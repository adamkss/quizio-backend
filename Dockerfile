FROM node:10-alpine
WORKDIR /usr/src/app

COPY . .
RUN npm install
RUN npm run build

EXPOSE 4000
CMD ["npm" , "run", "start:prod"]