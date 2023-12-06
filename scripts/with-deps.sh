#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

docker-compose up --wait db
trap 'docker-compose down db' EXIT

export PGPASSWORD=password
export PGUSER=user
export PGDATABASE=motorway
export PGHOST=localhost
"$@"
