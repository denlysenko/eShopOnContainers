FROM node:16.10.0-alpine3.14
WORKDIR /app
COPY apps/catalog-service/migrations/ ./migrations
COPY apps/catalog-service/orm-docker.config.js .
RUN npm install -g typeorm
RUN npm install -g pg
RUN apk add --no-cache git
RUN apk add --no-cache bash
RUN git clone https://github.com/vishnubob/wait-for-it.git
ENV NODE_PATH=/usr/local/lib/node_modules
CMD ["/bin/bash", "-c", "typeorm migration:run --config ./orm-docker.config.js"]