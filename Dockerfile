FROM node:14

WORKDIR /app

COPY package.json .
COPY server.js .
COPY index.html .
COPY images ./images

RUN npm install

EXPOSE 3000
CMD ["node", "server.js"]