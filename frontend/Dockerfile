FROM node:18-alpine AS build-step

ARG ANGULAR_BUILD_CONFIGURATION
ARG APP_URL_DEST

WORKDIR /app

# Install build dependencies
COPY ./package.json ./
COPY ./package-lock.json ./
RUN npm install -g npm@latest && \
    npm install -g @angular/cli && \
    npm install --legacy-peer-deps

# Copy app source
COPY ./src ./src
COPY ./angular.json ./
COPY ./tsconfig.app.json ./
COPY ./tsconfig.json ./
COPY ./tsconfig.spec.json ./

# Build Angular app
RUN echo "\n" | ng build --configuration=${ANGULAR_BUILD_CONFIGURATION} --base-href=/${APP_URL_DEST}/


FROM nginx:mainline-alpine

# copy compiled angular app from build-step
COPY --from=build-step /app/dist/lipidlibrarianweb /usr/share/nginx/html

# prepare nginx configuration
COPY ./nginx/default.conf.template /etc/nginx/templates/
