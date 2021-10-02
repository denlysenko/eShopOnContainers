FROM node:16.10.0-alpine3.14
WORKDIR /app
COPY package*.json .
RUN npm install --development
COPY . .
ENV NODE_ENV=test
RUN apk add --no-cache bash
CMD ["/bin/bash", "-c", "npm run e2e -- catalog-service"]
