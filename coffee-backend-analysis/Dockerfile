FROM node:20-alpine

WORKDIR /usr/src/api

COPY package*.json ./
RUN npm install --quiet --no-optional --no-fund

COPY . .
RUN npm run build

EXPOSE 3333
CMD ["npm", "run", "start:prod"]
