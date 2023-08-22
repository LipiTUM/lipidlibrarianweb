#!/usr/bin/env bash

source .env

pushd backend
source ./build_container.sh
popd

pushd frontend
source ./build_container.sh
popd
