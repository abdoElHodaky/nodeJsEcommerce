FROM node:18-alpine
WORKDIR /app
COPY . .
RUN apk add --no-cache tzdata  sqlite-dev postgresql-dev mysql-dev 
RUN rm -rf package-lock.json 
RUN yarn add typescript reflect-metadata class-transform class-transformer class-validator @decorators/di @decorators/express 
RUN npm install 
ENV PORT 3000
EXPOSE ${PORT}
CMD ["node","app.js"]
