#!/usr/bin/env bash

echo "Building lipidlibrarianweb_backend OCI container..."

buildah build --layers -f Containerfile \
    --build-arg LIPIDLIBRARIAN_GITHUB_COMMIT_REF=${LIPIDLIBRARIAN_GITHUB_COMMIT_REF} \
    -t lipidlibrarianweb_backend .

echo "Building lipidlibrarianweb_backend OCI container done."
