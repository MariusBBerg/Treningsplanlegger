FROM node:18.17.1-alpine3.18

# COPY [host machine] [container]
COPY package.json package-lock.json .

RUN npm install

COPY . .

RUN npm run build

CMD ["npm", "start"]