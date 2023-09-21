# LipidLibarianWeb

## Table of Contents
1. [Introduction](#introduction)
2. [Deployment](#deployment)
    1. [Build](#build)
    1. [Start](#start)
    1. [Debug](#debug)
    1. [Stop](#stop)
3. [API](docs/lipid-librarian-web-api-spec.yaml)

## Introduction

## Deployment

LipidLibrarianWeb is intended to be deployed in a containerized fashion. We support deployments with docker compose and podman pods. Kubernetes pods are very similar to podman pods, therefore the container build script an pod creation script may be useful.

Podman and its container build utility buildah may be used by any user via rootless containers, docker compose requires more privileges, which you can supply on UNIX for example by adding the user to the 'docker' group. Furthermore podman supports pods and containers as systemd services, as well as native IPv6 connectivity. The podman deployment has been tested with SELinux.

### Build

First copy `.env.template` to `.env` and follow the instructions inside `.env`.

Important: If you used docker to build the containers before and you want to change the build variables in `.env`, you have to make sure docker compose doesn't use the build cache when rebuilding the image, for example with `docker compose build --no-cache`. You can check if development mode is enabled for the frontend via the javascript console in your browser's debug tools. Buildah does not use build cache, so this is no issue, if you use it to build the containers.

To build the containers with docker compose:

```bash
docker compose build
```

or with buildah:

```bash
./build_containers.sh
```

### Start

To start the container and daemonize the session with docker compose:

```bash
docker compose up -d
```

or generate and start a pod with podman:

```bash
./podman-create-pod.sh
podman pod start lipidlibrarianweb
```

Podman has the unique ability to generate systemd units to manage startup/restart/shutdown for users and systems:

```bash
podman generate systemd \
    -f \
    --new \
    --after=network-online.target \
    --restart-policy=always
```

For system wide installation:

```bash
mv pod-lipidlibrarianweb.service container-lipidlibrarianweb-db.service container-lipidlibrarianweb-frontend.service container-lipidlibrarianweb-backend.service /etc/systemd/system
systemctl enable --now pod-lipidlibrarianweb.service
```

For the installation as a user if XDG_CONFIG_HOME is set (you can check with `echo $XDG_CONFIG_HOME`):

```bash
mv pod-lipidlibrarianweb.service container-lipidlibrarianweb-db.service container-lipidlibrarianweb-frontend.service container-lipidlibrarianweb-backend.service $XDG_CONFIG_HOME/systemd/user
systemctl --user enable --now pod-lipidlibrarianweb.service
```

else:

```bash
mv pod-lipidlibrarianweb.service container-lipidlibrarianweb-db.service container-lipidlibrarianweb-frontend.service container-lipidlibrarianweb-backend.service $HOME/.config/systemd/user
systemctl --user enable --now pod-lipidlibrarianweb.service
```

### Debug

To follow the logs of all containers over the session (cancel with CTRL+c) with docker compose:

```bash
docker compose logs -f
```

or with podman:

```bash
podman pod logs -f lipidlibrarianweb
```

### Stop

To delete the container and volumes for docker compose:

```bash
docker compose down -v
```

or with podman:

```bash
podman pod stop lipidlibrarianweb
podman pod rm lipidlibrarianweb
podman volume rm lipidlibrarianweb-db_data
podman volume rm lipidlibrarianweb-static_files
podman volume rm lipidlibrarianweb-media_files
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
