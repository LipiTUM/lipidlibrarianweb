#!/usr/bin/env bash

echo "Building lipid_librarian_web_frontend OCI container..."

ctr_angular_build=$(buildah from docker.io/library/node:18-alpine)

# set environment variables
buildah config --env ANGULAR_BUILD_CONFIGURATION=${ANGULAR_BUILD_CONFIGURATION} $ctr_angular_build
buildah config --env APP_URL_DEST=${APP_URL_DEST} $ctr_angular_build

buildah config --workingdir /app $ctr_angular_build

# Install build dependencies
buildah copy $ctr_angular_build ./package.json ./
buildah copy $ctr_angular_build ./package-lock.json ./
buildah run $ctr_angular_build /bin/sh -c '\
   npm install -g npm@latest; \
   npm install -g @angular/cli; \
   npm install;'

# Copy app source
buildah copy $ctr_angular_build ./src ./src
buildah copy $ctr_angular_build ./angular.json ./
buildah copy $ctr_angular_build ./tsconfig.app.json ./
buildah copy $ctr_angular_build ./tsconfig.json ./
buildah copy $ctr_angular_build ./tsconfig.spec.json ./

# Build Angular app
buildah run $ctr_angular_build /bin/sh -c '\
    echo "\n" | ng build --configuration=${ANGULAR_BUILD_CONFIGURATION} --base-href=/${APP_URL_DEST}/;'


ctr_lipid_librarian_web_frontend=$(buildah from docker.io/library/nginx:mainline-alpine)

# set environment variables
buildah config --env BACKEND_HOSTNAME=${BACKEND_HOSTNAME} $ctr_lipid_librarian_web_frontend
buildah config --env BACKEND_PORT=${BACKEND_PORT} $ctr_lipid_librarian_web_frontend

# copy compiled angular app from ctr_angular_build
buildah copy --from $ctr_angular_build $ctr_lipid_librarian_web_frontend /app/dist/lipid-librarian-web /usr/share/nginx/html

# prepare nginx configuration
buildah copy $ctr_lipid_librarian_web_frontend ./nginx/default.conf.template /etc/nginx/templates/

buildah commit --rm $ctr_lipid_librarian_web_frontend lipid_librarian_web_frontend:latest

buildah rm $ctr_angular_build

echo "Building lipid_librarian_web_frontend OCI container done."
