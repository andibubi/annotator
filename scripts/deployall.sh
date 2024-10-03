#!/usr/bin/env bash
SCRIPT=$(readlink -f "$0")
SCRIPTPATH=$(dirname "$SCRIPT")
scp docker-compose.yml  root@213.165.87.10:/root
scp docker-compose-server.yml  root@213.165.87.10:/root
scp nginx.conf  root@213.165.87.10:/root
scp scripts/server-deploy.sh root@213.165.87.10:/root
$SCRIPTPATH/deploy.sh
