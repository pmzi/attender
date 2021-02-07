FROM node:lts-alpine

WORKDIR /Attender

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN PUPPETEER_PRODUCT=firefox npm i

COPY . .

CMD ["node", "index.js"]