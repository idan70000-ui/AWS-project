FROM node:20-alpine AS development
WORKDIR /app
ENV NODE_ENV=development
COPY package*.json ./
RUN npm ci
COPY . .
USER node
EXPOSE 3000
CMD ["npx", "nodemon", "app.js"]


FROM node:20-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
RUN chown -R node:node /app
USER node
EXPOSE 3000
CMD ["node", "app.js"]