import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import ZoomBridge from 'react-native-zoom-bridge';
import Config from 'react-native-config';
import { first, isEmpty } from 'lodash';
import moment from 'moment';

import { styled, Button, Icon, withTheme, H4 } from '@apollosproject/ui-kit';

import { useCheckIn } from 'check-in';
import { useCurrentUser, useLinkRouter } from '../hooks';

const Cell = styled(({ theme }) => ({
  paddingBottom: theme.sizing.baseUnit * 0.5,
  flexDirection: 'column',
  justifyContent: 'flex-start',
}))(View);

const CellItem = styled(({ theme }) => ({
  paddingVertical: theme.sizing.baseUnit * 0.5,
  justifyContent: 'center',
  flex: 1,
}))(View);

const ButtonContentLayout = styled(({ theme }) => ({
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
}))(View);

const IconSpacing = styled(({ theme }) => ({
  paddingRight: theme.sizing.baseUnit * 0.3,
}))(View);

const StyledIcon = withTheme(({ theme }) => ({
  name: 'video',
  size: 18,
}))(Icon);

const VideoButton = ({ title, loading, ...props }) => (
  <Button {...props} loading={loading}>
    <ButtonContentLayout>
      <IconSpacing>
        <StyledIcon loading={loading} />
      </IconSpacing>

      <H4 loading={loading}>{title}</H4>
    </ButtonContentLayout>
  </Button>
);

VideoButton.propTypes = {
  title: PropTypes.string,
  loading: PropTypes.bool,
};

// const ZoomBridgeerType = 2; // 2 - pro user
const config = {
  zoom: {
    appKey: Config.ZOOM_SDK_APP_KEY, // SDK key created in Zoom app marketplace
    appSecret: Config.ZOOM_SDK_APP_SECRET, // SDK secret created in Zoom app marketplace
    domain: 'zoom.us',
  },
};

const VideoCall = ({ parentVideoCall, videoCall, isLoading, groupId }) => {
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

  return (
    <Cell>
      {!isEmpty(parentVideoCall) ? (
        <CellItem>
          <VideoButton
            onPress={() =>
              parentVideoCall.meetingId
                ? join(parentVideoCall.meetingId, parentVideoCall.passcode)
                : routeLink(parentVideoCall.link)
            }
            loading={isLoading || loading}
            title={parentVideoCall.labelText || 'Join Meeting'}
            type={'primary'}
            pill={false}
          />
        </CellItem>
      ) : null}
      {!isEmpty(videoCall) ? (
        <CellItem>
          <VideoButton
            onPress={() =>
              videoCall.meetingId
                ? join(videoCall.meetingId, videoCall.passcode)
                : routeLink(videoCall.link)
            }
            loading={isLoading}
            title={
              videoCall.labelText ||
              (!isEmpty(parentVideoCall) ? 'Join Breakout' : 'Join Meeting')
            }
            type={'primary'}
            pill={false}
          />
        </CellItem>
      ) : null}
    </Cell>
  );
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
