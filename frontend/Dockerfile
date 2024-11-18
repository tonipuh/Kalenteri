FROM node:18-alpine

WORKDIR /app

# Add necessary packages for node-gyp
RUN apk add --no-cache python3 make g++

COPY package*.json ./
COPY next.config.js ./
COPY postcss.config.js ./
COPY tailwind.config.js ./

RUN npm install

COPY . .

# Ensure correct permissions
RUN mkdir -p .next && chown -R node:node .

USER node

EXPOSE 3000
CMD ["npm", "run", "dev"]