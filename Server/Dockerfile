FROM node:12
WORKDIR app
COPY ./ /app

RUN npm install
RUN npm run build

ENV NODE_ENV=production
ENV APP_ORIGIN=https://ecad-fun.vercel.app
ENV AUTH0_AUDIENCE=https://ecad-server.azurewebsites.net
ENV AUTH0_ISSUER=https://relang.eu.auth0.com/

EXPOSE 8080
CMD ["node", "dist/index.js"]