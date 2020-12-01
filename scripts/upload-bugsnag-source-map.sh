#!/bin/bash

VERSION="$(jq .version package.json)"
BUGSNAG_KEY="$(cat .env | grep BUGSNAG_KEY= | sed 's/BUGSNAG_KEY=//')"
LOG="Uploading Source Map version $VERSION for $1"

if [ $VERSION != "" ] && [ $BUGSNAG_KEY != "" ]
then
    if [ $1 == "ios" ] || [ $1 == "android" ]
    then
        echo "$LOG"
        curl --http1.1 https://upload.bugsnag.com/react-native-source-map \
            -F apiKey="$BUGSNAG_KEY" \
            -F appVersion="$VERSION" \
            -F dev=false \
            -F platform="$1" \
            -F sourceMap="@$1-release.bundle.map" \
            -F bundle="@$1-release.bundle" \
            -F projectRoot=`pwd` 
    else
        echo "Please use either `ios` or `android` as a parameter"
    fi
else
    # Console error for missing version
    if [ $VERSION != "" ]
    then
        echo "Please make sure there is a valid version in your `package.json`"
    fi
    
    # Console error for missing bugsnag api key
    if [ $BUGSNAG_KEY != "" ]
    then
        echo "Please make sure there is a valid Bugsnag API Key in your `env` named BUGSNAG_KEY"
    fi
fi