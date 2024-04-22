FROM node:18.17.1-alpine3.18

# COPY [host machine] [container]
COPY package.json package-lock.json .

RUN npm install

ENV REACT_APP_API_URL=http://localhost:8080/
COPY . .

RUN npm run build

CMD ["npm", "start"]