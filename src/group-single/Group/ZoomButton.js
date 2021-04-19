import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import ZoomBridge from 'react-native-zoom-bridge';
import Config from 'react-native-config';
import { isEmpty } from 'lodash';

import { ActionBarItem } from 'ui/ActionBar';

import { useCurrentUser, useLinkRouter } from '../../hooks';

const VideoButton = ({ label, icon, onPress, isLoading }) => (
  <ActionBarItem
    label={label}
    icon={icon}
    onPress={onPress}
    isLoading={isLoading}
  />
);

VideoButton.propTypes = {
  label: PropTypes.string,
  icon: PropTypes.string,
  onPress: PropTypes.func,
  isLoading: PropTypes.bool,
};
VideoButton.defaultProps = {
  label: 'Join Video Call',
  icon: 'video',
  onPress: () => null,
  isLoading: false,
};

// const ZoomBridgeerType = 2; // 2 - pro user
const config = {
  zoom: {
    appKey: Config.ZOOM_SDK_APP_KEY, // SDK key created in Zoom app marketplace
    appSecret: Config.ZOOM_SDK_APP_SECRET, // SDK secret created in Zoom app marketplace
    domain: 'zoom.us',
  },
};

const VideoCall = ({ videoCall, onJoin, isLoading }) => {
  useEffect(() => {
    async function initializeZoom() {
      try {
        const initializeResult = await ZoomBridge.initialize(
          config.zoom.appKey,
          config.zoom.appSecret,
          config.zoom.domain
        );
        console.log({ initializeResult });
      } catch (e) {
        throw e;
      }
    }
    initializeZoom();
  }, []);

  const { firstName, nickName } = useCurrentUser();
  const { routeLink } = useLinkRouter();
  const name = nickName || firstName;

  const join = async (meetingId, passcode) => {
    if (onJoin && typeof onJoin === 'function') {
      onJoin();
    }

    try {
      if (passcode) {
        await ZoomBridge.joinMeetingWithPassword(name, meetingId, passcode);
      } else {
        await ZoomBridge.joinMeeting(name, meetingId);
      }
    } catch (e) {
      throw e;
    }
  };

  return !isEmpty(videoCall) || isLoading ? (
    <VideoButton
      onPress={() =>
        videoCall.meetingId
          ? join(videoCall.meetingId, videoCall.passcode)
          : routeLink(videoCall.link)
      }
      label={videoCall.labelText || 'Join Meeting'}
      isLoading={isLoading}
    />
  ) : null;
};

VideoCall.propTypes = {
  parentVideoCall: PropTypes.shape({
    labelText: PropTypes.string,
    link: PropTypes.string,
    meetingId: PropTypes.string,
    passcode: PropTypes.string,
  }),
  videoCall: PropTypes.shape({
    labelText: PropTypes.string,
    link: PropTypes.string,
    meetingId: PropTypes.string,
    passcode: PropTypes.string,
  }),
  groupId: PropTypes.string,
  isLoading: PropTypes.bool,
  onJoin: PropTypes.func,
};

VideoCall.defaultProps = {
  onJoin: () => null,
};

export default VideoCall;
