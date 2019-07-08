#!/usr/bin/env bash

droid_dir=$(pwd)/android

cp $droid_dir/gradle.properties.appcenter $droid_dir/gradle.properties

yarn
yarn run generate-stories