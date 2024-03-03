FROM node:16-alpine

WORKDIR /app/frontend/

COPY package*.json /app/frontend/

RUN npm i

COPY . /app/frontend/

CMD ["npm", "start"]