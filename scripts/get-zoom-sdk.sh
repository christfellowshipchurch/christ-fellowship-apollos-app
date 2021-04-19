#!/bin/sh
ZOOM_SDK="import_dev_sdk.sh"

if [ "$ZOOM_SDK_STAGE" == "prod" ]
then
    ZOOM_SDK="import_prod_sdk.sh"
fi

echo "Setting up Zoom's SDK: $ZOOM_SDK"

chmod +x  ./node_modules/react-native-zoom-bridge/bin/$ZOOM_SDK
./node_modules/react-native-zoom-bridge/bin/$ZOOM_SDK

chmod +x ./node_modules/react-native-zoom-bridge/bin/import_aars.sh
./node_modules/react-native-zoom-bridge/bin/import_aars.sh

if [ "$ZOOM_SDK_STAGE" == "prod" ]
then
    echo "Removing the MobileRTCScreeShare framework in prepration for prodution"
    rm -r ./node_modules/react-native-zoom-bridge/ios/libs/MobileRTCScreenShare.framework
    
    echo "Rebuilding Pod File"
    yarn pods

    echo "Finished setup of Zoom's SDK: $ZOOM_SDK"

    # echo "Running Bugnsag Source Map upload"
    # yarn bugsnag-release

    # echo "Starting Metro Bundler"
    # yarn start
fi