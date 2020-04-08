#!/usr/bin/env bash

droid_dir=$(pwd)/android

cp $droid_dir/gradle.properties.appcenter $droid_dir/gradle.properties

cd ios
pod install
cd ..

echo AppCenter pre build script is running

# You can comment this out if your app doesn't have an existing build number.
# VERSION_CODE=$((VERSION_CODE_SHIFT + APPCENTER_BUILD_ID))
IOS_VERSION_CODE=$((123 + APPCENTER_BUILD_ID))
ANDROID_VERSION_CODE=$((1735 + APPCENTER_BUILD_ID))

echo Using "$IOS_VERSION_CODE" as iOS build number
echo Using "$ANDROID_VERSION_CODE" as Android build number

echo $VERSION_CODE
plutil -replace CFBundleVersion -string "$IOS_VERSION_CODE" $(pwd)/ios/apolloschurchapp/Info.plist
sed -i "" 's/versionCode [^"]*/versionCode '$ANDROID_VERSION_CODE'/' $(pwd)/android/app/build.gradle

yarn generate-stories