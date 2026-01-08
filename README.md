# LipidLibarianWeb

## Table of Contents
- [LipidLibarianWeb](#lipidlibarianweb)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Development Deployment](#development-deployment)
  - [Deployment](#deployment)
    - [Build](#build)
    - [Start](#start)
    - [Debug](#debug)
    - [Stop](#stop)
    - [Deployment on Custom Prefix](#deployment-on-custom-prefix)

## Introduction

## Development Deployment

### Init ALEX123 Database

    mkdir alex123
    gdown 1K5-PnK9HEA5L0Y79CaLgFMKOQGddDSgi -O alex123/alex123_db.sql

alternatively:

    mkdir alex123

    podman run --detach \
      --name alex123-db \
      --env MARIADB_DATABASE=alex123 \
      --env MARIADB_USER=${ALEX123_DB_USER} \
      --env MARIADB_PASSWORD=${ALEX123_DB_PASSWORD} \
      --env MARIADB_RANDOM_ROOT_PASSWORD=1 \
      --env MARIADB_AUTO_UPGRADE=1 \
      --publish 3306:3306 \
      mariadb:latest

    # install lipidlibrarian to get the sync_alex123_sql_database script
    sync_alex123_sql_database \
      --sql mysql+pymysql://alex123:foo@127.0.0.1:3306/alex123

    podman exec alex123-db \
      mariadb-dump \
        -u"alex123" \
        -p"foo" \
        "alex123" \
        > alex123/alex123_db.sql

    podman stop --rm alex123-db

### Run frontend and backend with live-reload

    cp .env.template .env  # the defaults work for a dev environment
    podman compose -f compose.dev.yml --env-file .env up -d --build
    podman compose -f compose.dev.yml --env-file .env logs -f
    podman compose -f compose.dev.yml --env-file .env down

## Deployment

LipidLibrarianWeb is intended to be deployed in a containerized fashion. We support deployments with docker compose and podman pods. Kubernetes pods are very similar to podman pods, therefore the container build script an pod creation script may be useful.

Podman and its container build utility buildah may be used by any user via rootless containers, docker compose requires more privileges, which you can supply depending on the system for example by adding the user to the 'docker' group. Furthermore podman supports pods and containers as systemd services, as well as native IPv6 connectivity. The podman deployment has been tested with SELinux.

### Build

First copy `.env.template` to `.env` and follow the instructions inside `.env`.

Important: If you used docker to build the containers before and you want to change the build variables in `.env`, you have to make sure docker compose doesn't use the build cache when rebuilding the image, for example with `docker compose -f compose.prod.yml build --no-cache`.

To build the containers with docker compose:

```bash
docker compose -f compose.prod.yml build
```

or with podman compose:

```bash
podman compose -f compose.prod.yml build
```

or with buildah:

```bash
./build_containers.prod.sh
```

### Start

To start the container and daemonize the session with docker compose:

```bash
docker compose -f compose.prod.yml up -d
```

or with podman compose:

```bash
podman compose -f compose.prod.yml up -d
```

or generate and start a pod with podman:

```bash
./podman-create-pod.prod.sh
podman pod start lipidlibrarianweb
```

### Debug

To follow the logs of all containers over the session (cancel with CTRL+c) with docker compose:

```bash
docker compose -f compose.prod.yml logs -f
```

or with podman compose:

```bash
podman compose -f compose.prod.yml logs -f
```

or with podman pods:

```bash
podman pod logs -f lipidlibrarianweb
```

### Stop

To delete the container and volumes for docker compose:

```bash
docker compose -f compose.prod.yml down -v
```

or with podman compose:

```bash
podman compose -f compose.prod.yml down -v
```

or with podman:

```bash
podman pod stop lipidlibrarianweb
podman pod rm lipidlibrarianweb
podman volume rm lipidlibrarianweb-alex123-db_data
podman volume rm lipidlibrarianweb-db_data
podman volume rm lipidlibrarianweb-static_files
podman volume rm lipidlibrarianweb-dynamic_files
```

### Deployment on Custom Prefix

Set the relevant environment variables in `.env`:
```sh
...
APP_URL_DEST=lipidlibrarian
...
```

Configure your NGINX server to act as a proxy to LipidLibrarian, for example in `/etc/nginx/nginx.conf.d/lipidlibrarian.conf`:
```conf
server {
  listen 80;
  listen [::]:80;

  location /lipidlibrarian {
    proxy_pass http://localhost:8080/;
  }
}
```
