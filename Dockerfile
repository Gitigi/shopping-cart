FROM node:17-alpine3.14

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8000
CMD ["sh", "./wait-for.sh", "db:3306", "--", "./node_modules/.bin/nodemon", "app.mjs"]
