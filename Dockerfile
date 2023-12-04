FROM node:16.20.2-buster

WORKDIR /app
COPY . /app
EXPOSE 80

CMD cd /app && npm run start-dev-server