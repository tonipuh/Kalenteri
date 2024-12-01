FROM node:20-alpine

WORKDIR /app

# Asennetaan tzdata aikavyöhykkeitä varten
RUN apk add --no-cache tzdata

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 4000

CMD ["npm", "start"]