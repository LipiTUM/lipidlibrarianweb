#!/usr/bin/env bash

podman pod stop lipid_librarian_web
podman pod rm lipid_librarian_web

source .env

podman pod create \
  --publish '8080:80/tcp' \
  --name lipid_librarian_web

podman create \
  --pod lipid_librarian_web \
  --name lipid_librarian_web-db \
  --tz 'Europe/Berlin' \
  --volume 'lipid_librarian_web-db_data:/var/lib/postgresql/data:Z' \
  --env POSTGRES_DB=${DB_NAME} \
  --env POSTGRES_USER=${DB_USER} \
  --env POSTGRES_PASSWORD=${DB_PASSWORD} \
  postgres:alpine

podman create \
  --pod lipid_librarian_web \
  --name lipid_librarian_web-backend \
  --requires lipid_librarian_web-db \
  --tz 'Europe/Berlin' \
  --volume 'lipid_librarian_web-media_files:/app/media:z' \
  --volume 'lipid_librarian_web-static_files:/app/static:z' \
  --env DJANGO_DEBUG=${DJANGO_DEBUG} \
  --env DJANGO_SECRET_KEY=${DJANGO_SECRET_KEY} \
  --env DJANGO_ALLOWED_HOSTS=${DJANGO_ALLOWED_HOSTS} \
  --env DJANGO_LOG_LEVEL=${DJANGO_LOG_LEVEL} \
  --env DJANGO_DB_HOST=${DB_HOST} \
  --env DJANGO_DB_PORT=${DB_PORT} \
  --env DJANGO_DB_NAME=${DB_NAME} \
  --env DJANGO_DB_USER=${DB_USER} \
  --env DJANGO_DB_PASSWORD=${DB_PASSWORD} \
  lipid_librarian_web_backend:latest

podman create \
  --pod lipid_librarian_web \
  --name lipid_librarian_web-frontend \
  --requires lipid_librarian_web-backend \
  --tz='Europe/Berlin' \
  --volume 'lipid_librarian_web-media_files:/usr/share/nginx/media:ro,z' \
  --volume 'lipid_librarian_web-static_files:/usr/share/nginx/static:ro,z' \
  lipid_librarian_web_frontend:latest
