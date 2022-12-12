FROM node:16-alpine

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

RUN yarn run build

CMD [ "node", ".", "Mortal Shell", "Mortal Shell: Enhanced Edition", "--drops" ]
