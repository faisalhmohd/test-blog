FROM node:16

WORKDIR /usr/src

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .

EXPOSE 8085

CMD [ "yarn", "dev" ]
