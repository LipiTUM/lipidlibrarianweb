#!/usr/bin/env bash

source .env

pushd backend

echo "Building lipidlibrarianweb_backend OCI container..."

buildah build --layers -f Containerfile \
    --build-arg LIPIDLIBRARIAN_GIT_BRANCH=${LIPIDLIBRARIAN_GIT_BRANCH} \
    -t lipidlibrarianweb_backend .

echo "Building lipidlibrarianweb_backend OCI container done."

popd

pushd frontend

echo "Building lipidlibrarianweb_frontend OCI container..."

buildah build --layers -f Containerfile \
  --build-arg APP_URL_DEST="${APP_URL_DEST}" \
  -t lipidlibrarianweb_frontend .

echo "Building lipidlibrarianweb_frontend OCI container done."

popd
