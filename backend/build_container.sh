#!/usr/bin/env bash

echo "Building lipidlibrarianweb_backend OCI container..."

buildah build --layers -f Containerfile \
    --build-arg LIPIDLIBRARIAN_GIT_BRANCH=${LIPIDLIBRARIAN_GIT_BRANCH} \
    -t lipidlibrarianweb_backend .

echo "Building lipidlibrarianweb_backend OCI container done."
