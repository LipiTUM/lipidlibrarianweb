#!/usr/bin/env bash

echo "Building lipidlibrarianweb_frontend OCI container..."

buildah build --layers -f Containerfile \
  --build-arg FRONTEND_PORT=${FRONTEND_PORT} \
  --build-arg ANGULAR_BUILD_CONFIGURATION=${ANGULAR_BUILD_CONFIGURATION} \
  --build-arg APP_URL_DEST=${APP_URL_DEST} \
  -t lipidlibrarianweb_frontend .

echo "Building lipidlibrarianweb_frontend OCI container done."
