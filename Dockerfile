FROM node:20

WORKDIR /app
COPY backend/package*.json ./
RUN npm install --production
COPY backend .
CMD ["node", "index.js"]
