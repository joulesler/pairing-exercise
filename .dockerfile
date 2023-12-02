FROM node:16.20.2-buster

COPY ./* /

CMD "npm run start-dev"