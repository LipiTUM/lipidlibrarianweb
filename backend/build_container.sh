#!/usr/bin/env bash

echo "Building lipidlibrarianweb_backend OCI container..."

buildah build -f Containerfile -t lipidlibrarianweb_backend .

echo "Building lipidlibrarianweb_backend OCI container done."
