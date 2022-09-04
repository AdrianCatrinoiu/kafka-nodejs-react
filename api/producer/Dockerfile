FROM node:16
WORKDIR /home/node
USER node
COPY package.json ./
RUN npm install
COPY --chown=node:node . .
CMD ["node", "producer.js"]
