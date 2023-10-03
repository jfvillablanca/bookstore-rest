FROM node:20-alpine3.17

RUN apk add --no-cache yarn

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn install

COPY . .

EXPOSE 3000

CMD yarn start:dev
