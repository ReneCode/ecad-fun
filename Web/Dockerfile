
FROM node:12 as build
WORKDIR app
COPY ./ /app
RUN npm install
RUN npm run build:prod 

FROM nginx
COPY --from=build /app/build/ /usr/share/nginx/html
COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf

