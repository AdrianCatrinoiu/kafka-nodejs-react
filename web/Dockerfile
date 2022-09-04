FROM node:16

WORKDIR /usr/src/app/web

COPY package*.json ./

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]