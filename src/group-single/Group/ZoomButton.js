import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import ZoomBridge from 'react-native-zoom-bridge';
import Config from 'react-native-config';
import { first, isEmpty } from 'lodash';
import moment from 'moment';

import { ActionBarItem } from 'ui/ActionBar';

import { useCheckIn } from '../../check-in';
import { useCurrentUser, useLinkRouter } from '../../hooks';

const VideoButton = ({ label, icon, onPress }) => (
  <ActionBarItem label={label} icon={icon} onPress={onPress} />
);

VideoButton.propTypes = {
  label: PropTypes.string,
  icon: PropTypes.string,
  onPress: PropTypes.func,
};
VideoButton.defaultProps = {
  label: 'Join Video Call',
  icon: 'video',
  onPress: () => null,
};

// const ZoomBridgeerType = 2; // 2 - pro user
const config = {
  zoom: {
    appKey: Config.ZOOM_SDK_APP_KEY, // SDK key created in Zoom app marketplace
    appSecret: Config.ZOOM_SDK_APP_SECRET, // SDK secret created in Zoom app marketplace
    domain: 'zoom.us',
  },
};

const VideoCall = ({ videoCall, groupId }) => {
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

  const { loading, options, checkInCurrentUser } = useCheckIn({
    nodeId: groupId,
  });
  const { firstName, nickName } = useCurrentUser();
  const { routeLink } = useLinkRouter();
  const name = nickName || firstName;

  const join = async (meetingId, passcode) => {
    if (options.length > 0) {
      const closestCheckInOption = first(
        options.sort((a, b) => Math.abs(moment(a).diff(b)))
      );

      if (closestCheckInOption.id) {
        checkInCurrentUser({ optionId: closestCheckInOption.id });
      }
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

  if (loading && !options) return null;

  return !isEmpty(videoCall) ? (
    <VideoButton
      onPress={() =>
        videoCall.meetingId
          ? join(videoCall.meetingId, videoCall.passcode)
          : routeLink(videoCall.link)
      }
      label={videoCall.labelText || 'Join Meeting'}
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
};

export default VideoCall;
