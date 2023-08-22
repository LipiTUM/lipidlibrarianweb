#!/usr/bin/env bash

echo "Building lipid_librarian_web_backend OCI container..."

ctr_lipid_librarian_web_backend=$(buildah from docker.io/library/python:3.10)

# set environment variables
buildah config --env LIPID_LIBRARIAN_GITHUB_COMMIT_SHA=${LIPID_LIBRARIAN_GITHUB_COMMIT_SHA} $ctr_lipid_librarian_web_backend

buildah config --workingdir /app $ctr_lipid_librarian_web_backend

# Install pipeline and container-entrypoint.sh dependencies
buildah run $ctr_lipid_librarian_web_backend /bin/sh -c '\
    apt-get update; \
    apt-get install -y \
        netcat-openbsd \
        git;'

# Clone and Checkout LipidLibrarian
buildah run $ctr_lipid_librarian_web_backend /bin/sh -c '\
    git clone https://github.com/LipiTUM/lipidlibrarian.git /app/lipid-librarian;'
buildah config --workingdir /app/lipid-librarian $ctr_lipid_librarian_web_backend
buildah run $ctr_lipid_librarian_web_backend /bin/sh -c '\
    git checkout ${LIPID_LIBRARIAN_GITHUB_COMMIT_SHA};'

# Install virtual environment to /opt/venv
buildah config --env PATH='/opt/venv/bin:$PATH' $ctr_lipid_librarian_web_backend
buildah run $ctr_lipid_librarian_web_backend /bin/sh -c '\
    ln -sf /app/lipid-librarian/venv /opt/venv;'

# Install LipidLibrarian
buildah run $ctr_lipid_librarian_web_backend /bin/sh -c '\
    make install;'

buildah config --workingdir /app $ctr_lipid_librarian_web_backend

buildah copy $ctr_lipid_librarian_web_backend ./requirements.txt ./
buildah run $ctr_lipid_librarian_web_backend /bin/sh -c '\
    pip install --no-cache-dir --upgrade pip; \
    pip install --no-cache-dir -r requirements.txt;'

# Bundle app source
buildah copy $ctr_lipid_librarian_web_backend ./lipid_librarian_web ./lipid_librarian_web
buildah copy $ctr_lipid_librarian_web_backend ./lipid_librarian_web_api ./lipid_librarian_web_api
buildah copy $ctr_lipid_librarian_web_backend ./manage.py ./
buildah copy $ctr_lipid_librarian_web_backend ./container-entrypoint.sh ./
buildah run $ctr_lipid_librarian_web_backend /bin/sh -c '\
    chmod +x container-entrypoint.sh;'

# Prepare the start command
buildah config --port 8000 $ctr_lipid_librarian_web_backend
buildah config --cmd '' $ctr_lipid_librarian_web_backend
buildah config --entrypoint /app/container-entrypoint.sh $ctr_lipid_librarian_web_backend

buildah commit --rm $ctr_lipid_librarian_web_backend lipid_librarian_web_backend:latest

echo "Building lipid_librarian_web_backend OCI container done."
