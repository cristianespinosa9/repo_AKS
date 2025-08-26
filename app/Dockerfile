FROM node:18-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev || npm i --omit=dev
COPY index.js ./
EXPOSE 3000
CMD ["node","index.js"]
