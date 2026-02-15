#!/usr/bin/env bash

podman pod stop lipidlibrarianweb
podman pod rm lipidlibrarianweb

source .env

podman pod create \
  --publish "8000:8000/tcp" \
  --publish "8001:8001/tcp" \
  --publish "3306:3306/tcp" \
  --name lipidlibrarianweb

podman create \
  --pod lipidlibrarianweb \
  --name lipidlibrarianweb-alex123-db \
  --tz ${APP_TIMEZONE} \
  --volume './alex123:/docker-entrypoint-initdb.d:O' \
  --volume 'lipidlibrarianweb-alex123-db_data:/var/lib/mysql:Z' \
  --env MARIADB_DATABASE=alex123 \
  --env MARIADB_USER=${ALEX123_DB_USER} \
  --env MARIADB_PASSWORD=${ALEX123_DB_PASSWORD} \
  --env MARIADB_RANDOM_ROOT_PASSWORD=1 \
  --env MARIADB_AUTO_UPGRADE=1 \
  mariadb:latest

podman create \
  --pod lipidlibrarianweb \
  --name lipidlibrarianweb-backend \
  --tz ${APP_TIMEZONE} \
  --volume './backend:/app:O' \
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
  --name lipid_ibrarianweb-frontend \
  --tz ${APP_TIMEZONE} \
  --volume './frontend:/app:O' \
  --volume '/app/node_modules' \
  --volume '/app/.angular/cache' \
  --env FRONTEND_PORT=8000 \
  --env BACKEND_HOST=localhost \
  --env BACKEND_PORT=8001 \
  lipidlibrarianweb_frontend:latest
