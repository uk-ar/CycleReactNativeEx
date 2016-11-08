#!/bin/sh
set -ex

echo '{"appHubId":"'$appHubId'","appHubSecret":"'$appHubSecret'"}' > .apphub
./node_modules/.bin/apphubdeploy -t "all" -a 1.0
#\n$appHubSecret'
