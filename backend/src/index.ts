import express from 'express';
import cors from 'cors';
import sunlightRouter from './routes/sunlight';
import citiesRouter from './routes/cities';

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

app.use('/sunlight', sunlightRouter);
app.use('/cities', citiesRouter);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});