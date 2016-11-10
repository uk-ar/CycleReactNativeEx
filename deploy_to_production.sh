#!/bin/sh
set -ex

#cp -f ios/CycleReactNativeEx/AppDelegate.apphub.m ios/CycleReactNativeEx/AppDelegate.m
patch -u ios/CycleReactNativeEx/AppDelegate.m < ios/CycleReactNativeEx/AppDelegate.diff.m
echo '{"appHubId":"'$appHubId'","appHubSecret":"'$appHubSecret'"}' > .apphub
./node_modules/.bin/apphubdeploy -t "all" -a 1.0
git checkout -- ios/CycleReactNativeEx/AppDelegate.m
#\n$appHubSecret'
