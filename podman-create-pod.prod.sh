#!/usr/bin/env bash

podman pod stop lipidlibrarianweb
podman pod rm lipidlibrarianweb

source .env

podman pod create \
  --publish "${APP_PORT}:8000/tcp" \
  --name lipidlibrarianweb

podman create \
  --pod lipidlibrarianweb \
  --name lipidlibrarianweb-alex123-db \
  --tz ${APP_TIMEZONE} \
  --volume 'lipidlibrarianweb-alex123-db_data:/var/lib/mysql:Z,U' \
  --env MARIADB_DATABASE=alex123 \
  --env MARIADB_USER=${ALEX123_DB_USER} \
  --env MARIADB_PASSWORD=${ALEX123_DB_PASSWORD} \
  --env MARIADB_RANDOM_ROOT_PASSWORD=1 \
  --env MARIADB_AUTO_UPGRADE=1 \
  mariadb:latest

podman create \
  --pod lipidlibrarianweb \
  --name lipidlibrarianweb-db \
  --tz ${APP_TIMEZONE} \
  --volume 'lipidlibrarianweb-db_data:/var/lib/postgresql/data:Z,U' \
  --env POSTGRES_DB=${DB_NAME} \
  --env POSTGRES_USER=${DB_USER} \
  --env POSTGRES_PASSWORD=${DB_PASSWORD} \
  postgres:alpine

podman create \
  --pod lipidlibrarianweb \
  --name lipidlibrarianweb-cache \
  --tz ${APP_TIMEZONE} \
  -u root \
  docker.io/valkey/valkey:9-alpine

podman create \
  --pod lipidlibrarianweb \
  --name lipidlibrarianweb-backend \
  --requires lipidlibrarianweb-db \
  --requires lipidlibrarianweb-alex123-db \
  --requires lipidlibrarianweb-cache \
  --tz ${APP_TIMEZONE} \
  --volume 'lipidlibrarianweb-dynamic_files:/app/dynamic:z,U' \
  --volume 'lipidlibrarianweb-static_files:/app/static:z,U' \
  --env DJANGO_SECRET_KEY=${DJANGO_SECRET_KEY} \
  --env DJANGO_ALLOWED_HOSTS="localhost 127.0.0.1" \
  --env DJANGO_DB_HOST=localhost \
  --env DJANGO_DB_PORT=5432 \
  --env DJANGO_DB_NAME=${DB_NAME} \
  --env DJANGO_DB_USER=${DB_USER} \
  --env DJANGO_DB_PASSWORD=${DB_PASSWORD} \
  --env DJANGO_CACHE_HOST=localhost \
  --env DJANGO_CACHE_PORT=6379 \
  --env BACKEND_PORT=8001 \
  --env ALEX123_DB_NAME=${ALEX123_DB_NAME} \
  --env ALEX123_DB_USER=${ALEX123_DB_USER} \
  --env ALEX123_DB_PASSWORD=${ALEX123_DB_PASSWORD} \
  --env ALEX123_DB_HOST=localhost \
  --env ALEX123_DB_PORT=3306 \
  -u root \
  lipidlibrarianweb_backend:latest

podman create \
  --pod lipidlibrarianweb \
  --name lipidlibrarianweb-backend-worker01 \
  --requires lipidlibrarianweb-backend \
  --tz ${APP_TIMEZONE} \
  --volume 'lipidlibrarianweb-dynamic_files:/app/dynamic:z,U' \
  --volume 'lipidlibrarianweb-static_files:/app/static:z,U' \
  --env DJANGO_SECRET_KEY=${DJANGO_SECRET_KEY} \
  --env DJANGO_ALLOWED_HOSTS="localhost 127.0.0.1" \
  --env DJANGO_DB_HOST=localhost \
  --env DJANGO_DB_PORT=5432 \
  --env DJANGO_DB_NAME=${DB_NAME} \
  --env DJANGO_DB_USER=${DB_USER} \
  --env DJANGO_DB_PASSWORD=${DB_PASSWORD} \
  --env DJANGO_CACHE_HOST=localhost \
  --env DJANGO_CACHE_PORT=6379 \
  --env BACKEND_PORT=8001 \
  --env ALEX123_DB_NAME=${ALEX123_DB_NAME} \
  --env ALEX123_DB_USER=${ALEX123_DB_USER} \
  --env ALEX123_DB_PASSWORD=${ALEX123_DB_PASSWORD} \
  --env ALEX123_DB_HOST=localhost \
  --env ALEX123_DB_PORT=3306 \
  -u root \
  lipidlibrarianweb_backend:latest \
  worker

podman create \
  --pod lipidlibrarianweb \
  --name lipidlibrarianweb-backend-worker02 \
  --requires lipidlibrarianweb-backend \
  --tz ${APP_TIMEZONE} \
  --volume 'lipidlibrarianweb-dynamic_files:/app/dynamic:z,U' \
  --volume 'lipidlibrarianweb-static_files:/app/static:z,U' \
  --env DJANGO_SECRET_KEY=${DJANGO_SECRET_KEY} \
  --env DJANGO_ALLOWED_HOSTS="localhost 127.0.0.1" \
  --env DJANGO_DB_HOST=localhost \
  --env DJANGO_DB_PORT=5432 \
  --env DJANGO_DB_NAME=${DB_NAME} \
  --env DJANGO_DB_USER=${DB_USER} \
  --env DJANGO_DB_PASSWORD=${DB_PASSWORD} \
  --env DJANGO_CACHE_HOST=localhost \
  --env DJANGO_CACHE_PORT=6379 \
  --env BACKEND_PORT=8001 \
  --env ALEX123_DB_NAME=${ALEX123_DB_NAME} \
  --env ALEX123_DB_USER=${ALEX123_DB_USER} \
  --env ALEX123_DB_PASSWORD=${ALEX123_DB_PASSWORD} \
  --env ALEX123_DB_HOST=localhost \
  --env ALEX123_DB_PORT=3306 \
  -u root \
  lipidlibrarianweb_backend:latest \
  worker

podman create \
  --pod lipidlibrarianweb \
  --name lipid_ibrarianweb-frontend \
  --tz ${APP_TIMEZONE} \
  --env FRONTEND_PORT=8000 \
  --env BACKEND_HOST=localhost \
  --env BACKEND_PORT=8001 \
  --volume 'lipidlibrarianweb-dynamic_files:/usr/share/nginx/dynamic:ro,z' \
  --volume 'lipidlibrarianweb-static_files:/usr/share/nginx/static:ro,z' \
  lipidlibrarianweb_frontend:latest
