#!/usr/bin/env bash

podman pod stop lipidlibrarianweb
podman pod rm lipidlibrarianweb

source .env

podman pod create \
  --publish '8080:${FRONTEND_PORT}/tcp' \
  --name lipidlibrarianweb

podman create \
  --pod lipidlibrarianweb \
  --name lipidlibrarianweb-db \
  --tz 'Europe/Berlin' \
  --volume 'lipidlibrarianweb-db_data:/var/lib/postgresql/data:Z' \
  --env POSTGRES_DB=${DB_NAME} \
  --env POSTGRES_USER=${DB_USER} \
  --env POSTGRES_PASSWORD=${DB_PASSWORD} \
  postgres:alpine

podman create \
  --pod lipidlibrarianweb \
  --name lipidlibrarianweb-backend \
  --requires lipidlibrarianweb-db \
  --tz 'Europe/Berlin' \
  --volume 'lipidlibrarianweb-media_files:/app/media:z' \
  --volume 'lipidlibrarianweb-static_files:/app/static:z' \
  --env DJANGO_DEBUG=${DJANGO_DEBUG} \
  --env DJANGO_SECRET_KEY=${DJANGO_SECRET_KEY} \
  --env DJANGO_ALLOWED_HOSTS=${DJANGO_ALLOWED_HOSTS} \
  --env DJANGO_LOG_LEVEL=${DJANGO_LOG_LEVEL} \
  --env DJANGO_DB_HOST=${DB_HOST} \
  --env DJANGO_DB_PORT=${DB_PORT} \
  --env DJANGO_DB_NAME=${DB_NAME} \
  --env DJANGO_DB_USER=${DB_USER} \
  --env DJANGO_DB_PASSWORD=${DB_PASSWORD} \
  lipidlibrarianweb_backend:latest

podman create \
  --pod lipidlibrarianweb \
  --name lipid_ibrarianweb-frontend \
  --requires lipidlibrarianweb-backend \
  --tz='Europe/Berlin' \
  --volume 'lipidlibrarianweb-media_files:/usr/share/nginx/media:ro,z' \
  --volume 'lipidlibrarianweb-static_files:/usr/share/nginx/static:ro,z' \
  lipidlibrarianweb_frontend:latest
