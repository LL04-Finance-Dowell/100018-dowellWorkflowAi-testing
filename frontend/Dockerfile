FROM node:18-alpine

WORKDIR /app/frontend/

COPY package*.json /app/frontend/

RUN npm install \
    && ls -al node_modules/react-scripts \
    && npm cache clean --force

COPY . /app/frontend/

CMD ["npm", "start"]