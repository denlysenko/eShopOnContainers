FROM node:16.10.0-alpine3.14 AS build
WORKDIR /app
COPY package*.json .
RUN npm install --development
COPY . .
RUN npm run build -- basket-service --prod

FROM node:16.10.0-alpine3.14 AS prod
COPY --from=build /app/dist/apps/basket-service .
COPY --from=build /app/apps/basket-service/.env .env
RUN npm install --production

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000
EXPOSE ${PORT}

CMD ["node", "main.js"]
