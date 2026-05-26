FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache python3 make g++ openjdk17-jdk

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["node", "src/index.js"]
