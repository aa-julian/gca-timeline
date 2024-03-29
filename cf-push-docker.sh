#!/usr/bin/env bash

service=gca-db
status=$(cf service $service | sed -n 3p)
if [[ $status = "FAILED" ]]; then
  exit 1
fi

app=gca-timeline

cf push $app \
    -m 128M \
    -k 2048M \
    --docker-image quay.io/aajulian/$app \
    --no-start

# bind hana service
cf bind-service $app $service

cf start $app