FROM node:18.17.1-alpine3.18

# COPY [host machine] [container]
COPY package.json package-lock.json .

RUN npm install
ENV NODE_OPTIONS="--max-old-space-size=2048"

ENV NODE_OPTIONS="--max-old-space-size=1024"

COPY . .

RUN npm run build

CMD ["npm", "start"]
