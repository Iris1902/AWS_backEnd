# Build Stage
FROM node:18.20.4-alpine AS build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

# Final Stage
FROM node:18.20.4-alpine

WORKDIR /usr/src/app

COPY --from=build /usr/src/app /usr/src/app

EXPOSE 3000

CMD ["npm", "start"]