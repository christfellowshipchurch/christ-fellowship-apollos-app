#!/bin/bash

VERSION="$(jq .version package.json)"
LOG="Generating Source Map version $VERSION for $1"

if [ $VERSION != "" ]
then
    if [ $1 == "ios" ] || [ $1 == "android" ]
    then
        echo "$LOG"
        react-native bundle \
            --platform ios \
            --dev false \
            --entry-file index.js \
            --bundle-output "$1-release.bundle" \
            --sourcemap-output "$1f-release.bundle.map"
    else
        echo "Please use either `ios` or `android` as a parameter"  
    fi
else
    echo "Please make sure there is a valid version in your `package.json`"
fi
