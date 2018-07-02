FROM node:8-alpine

WORKDIR /usr/src/app

COPY dist ./dist
COPY entrypoint.sh .
COPY package.json .

EXPOSE 9000

CMD sh entrypoint.sh

