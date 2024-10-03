#!/usr/bin/env bash
SCRIPT=$(readlink -f "$0")
SCRIPTPATH=$(dirname "$SCRIPT")
#./mvnw -Pprod install -DskipTests
scp target/annotator-0.0.1-SNAPSHOT.jar root@213.165.87.10:/root
ssh root@213.165.87.10 '~/server-deploy.sh'
