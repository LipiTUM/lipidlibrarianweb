#!/usr/bin/env bash

echo "Building lipidlibrarianweb_backend OCI container..."

buildah build --layers -f Containerfile \
    --build-arg LIPIDLIBRARIAN_GIT_BRANCH=${LIPIDLIBRARIAN_GIT_BRANCH} \
    -t lipidlibrarianweb_backend .

echo "Building lipidlibrarianweb_backend OCI container done."

echo "Building lipidlibrarianweb_backend_worker OCI container..."

buildah build --layers -f Containerfile.worker \
    --build-arg LIPIDLIBRARIAN_GIT_BRANCH=${LIPIDLIBRARIAN_GIT_BRANCH} \
    -t lipidlibrarianweb_backend_worker .

echo "Building lipidlibrarianweb_backend_worker OCI container done."
