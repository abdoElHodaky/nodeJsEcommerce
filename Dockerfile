FROM node:18-alpine
WORKDIR /app
COPY . .
RUN apk add --no-cache tzdata  sqlite-dev postgresql-dev mysql-dev 
RUN npm install 
ENV PORT 3000
EXPOSE ${PORT}
CMD ["node","app.js"]
