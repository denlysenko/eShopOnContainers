FROM node:16.10.0-alpine3.14 AS build
WORKDIR /app
COPY package*.json .
RUN npm install --development
COPY . .
RUN npm run build -- web-shopping --prod

FROM nginx:1.21-alpine AS prod
COPY --from=build /app/dist/apps/web-shopping /usr/share/nginx/html
COPY --from=build /app/apps/web-shopping/docker/default.conf /etc/nginx/conf.d/

EXPOSE 80
