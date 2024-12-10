import express from 'express';
import cors from 'cors';
import sunlightRouter from './routes/sunlight';
import citiesRouter from './routes/cities';
import multer from 'multer';
import xlsx from 'xlsx';

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/sunlight', sunlightRouter);
app.use('/cities', citiesRouter);

const upload = multer({ dest: 'uploads/' });

app.post('/api/events', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const workbook = xlsx.readFile(req.file.path);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(worksheet);

    console.log('Raw Excel data:', JSON.stringify(data, null, 2));

    if (!data || !Array.isArray(data) || data.length === 0) {
      return res.status(400).json({ error: 'Invalid Excel file format' });
    }

    const groupedEvents = data.reduce((acc: any[], row: any) => {
      console.log('Processing row:', row);

      if (!row.pvm || !row.kello || !row.kpl) {
        throw new Error(`Missing required fields in Excel file. Row data: ${JSON.stringify(row)}`);
      }

      const date = new Date((row.pvm - 25569) * 86400 * 1000);

      const totalHours = row.kello * 24;
      const hours = Math.floor(totalHours);
      const minutes = Math.round((totalHours - hours) * 60);

      const total = Number(row.kpl);

      if (isNaN(date.getTime()) || isNaN(hours) || isNaN(minutes) || isNaN(total)) {
        throw new Error(`Invalid data format in Excel file. Row data: ${JSON.stringify(row)}`);
      }

      const existingEvent = acc.find(event =>
        event.date.toISOString().split('T')[0] === date.toISOString().split('T')[0] &&
        event.hour === hours
      );

      if (existingEvent) {
        existingEvent.total += total;
      } else {
        acc.push({ date, hour: hours, total });
      }

      return acc;
    }, []);

    res.json(groupedEvents);
  } catch (error) {
    console.error('Error processing Excel file:', error);
    res.status(400).json({ error: error.message || 'Error processing Excel file' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});