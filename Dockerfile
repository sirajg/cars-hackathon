FROM node:4.4

RUN mkdir -p /Users/sghaffar/ws
WORKDIR /Users/sghaffar/ws
COPY ./app/ ./
RUN npm install

CMD ["npm", "start"]
