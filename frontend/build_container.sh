#!/usr/bin/env bash

echo "Building lipidlibrarianweb_frontend OCI container..."

buildah build -f Containerfile -t lipidlibrarianweb_frontend .

echo "Building lipidlibrarianweb_frontend OCI container done."
