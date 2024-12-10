FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./

# Asennetaan tsx
RUN npm install
RUN npm install -g tsx

COPY . .

EXPOSE 4000

# Käytetään tsx:ää ts-noden sijaan
CMD ["tsx", "src/index.ts"]