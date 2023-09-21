#!/usr/bin/env bash

echo "Building lipidlibrarianweb_backend OCI container..."

ctr_lipidlibrarianweb_backend=$(buildah from docker.io/library/python:3.10)

# set environment variables
buildah config --env LIPIDLIBRARIAN_GITHUB_COMMIT_REF=${LIPIDLIBRARIAN_GITHUB_COMMIT_REF} $ctr_lipidlibrarianweb_backend

buildah config --workingdir /app $ctr_lipidlibrarianweb_backend

# Install pipeline and container-entrypoint.sh dependencies
buildah run $ctr_lipidlibrarianweb_backend /bin/sh -c '\
    apt-get update; \
    apt-get install -y \
        netcat-openbsd \
        git;'

# Clone and Checkout LipidLibrarian
buildah run $ctr_lipidlibrarianweb_backend /bin/sh -c '\
    git clone https://github.com/LipiTUM/lipidlibrarian.git /app/lipidlibrarian;'
buildah config --workingdir /app/lipidlibrarian $ctr_lipidlibrarianweb_backend
buildah run $ctr_lipidlibrarianweb_backend /bin/sh -c '\
    git checkout ${LIPIDLIBRARIAN_GITHUB_COMMIT_REF};'

# Install virtual environment to /opt/venv
buildah config --env PATH='/opt/venv/bin:$PATH' $ctr_lipidlibrarianweb_backend
buildah run $ctr_lipidlibrarianweb_backend /bin/sh -c '\
    ln -sf /app/lipidlibrarian/venv /opt/venv;'

# Install LipidLibrarian
buildah run $ctr_lipidlibrarianweb_backend /bin/sh -c '\
    make install;'

buildah config --workingdir /app $ctr_lipidlibrarianweb_backend

buildah copy $ctr_lipidlibrarianweb_backend ./requirements.txt ./
buildah run $ctr_lipidlibrarianweb_backend /bin/sh -c '\
    pip install --no-cache-dir --upgrade pip; \
    pip install --no-cache-dir -r requirements.txt;'

# Bundle app source
buildah copy $ctr_lipidlibrarianweb_backend ./lipidlibrarianweb ./lipidlibrarianweb
buildah copy $ctr_lipidlibrarianweb_backend ./lipidlibrarianweb_api ./lipidlibrarianweb_api
buildah copy $ctr_lipidlibrarianweb_backend ./manage.py ./
buildah copy $ctr_lipidlibrarianweb_backend ./container-entrypoint.sh ./
buildah run $ctr_lipidlibrarianweb_backend /bin/sh -c '\
    chmod +x container-entrypoint.sh;'

# Prepare the start command
buildah config --port 8000 $ctr_lipidlibrarianweb_backend
buildah config --cmd '' $ctr_lipidlibrarianweb_backend
buildah config --entrypoint /app/container-entrypoint.sh $ctr_lipidlibrarianweb_backend

buildah commit --rm $ctr_lipidlibrarianweb_backend lipidlibrarianweb_backend:latest

echo "Building lipidlibrarianweb_backend OCI container done."
