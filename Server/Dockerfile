FROM node:12
WORKDIR app
COPY ./ /app

RUN npm install
RUN npm run build

ENV NODE_ENV=production

EXPOSE 8080
CMD ["node", "dist/index.js"]