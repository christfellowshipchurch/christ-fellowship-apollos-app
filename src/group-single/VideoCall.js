import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import ZoomBridge from 'react-native-zoom-bridge';
import Config from 'react-native-config';
import isEmpty from 'lodash/isEmpty';
import moment from 'moment';

import { useMutation } from '@apollo/react-hooks';
import { styled, Button } from '@apollosproject/ui-kit';

import { useCurrentUser } from '../hooks';

import ATTEND_MEETING from './attendMeeting';

const Cell = styled(({ theme }) => ({
  paddingBottom: theme.sizing.baseUnit * 0.5,
  flexDirection: 'row',
  justifyContent: 'flex-start',
}))(View);

const CellItem = styled(({ theme, first }) => ({
  marginRight: first ? theme.sizing.baseUnit : 0,
  justifyContent: 'center',
  flex: 1,
}))(View);

// const ZoomBridgeerType = 2; // 2 - pro user
const config = {
  zoom: {
    appKey: Config.ZOOM_SDK_APP_KEY, // SDK key created in Zoom app marketplace
    appSecret: Config.ZOOM_SDK_APP_SECRET, // SDK secret created in Zoom app marketplace
    domain: 'zoom.us',
  },
};

const VideoCall = ({
  parentVideoCall,
  videoCall,
  isLoading,
  groupId,
  date,
}) => {
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
  const name = nickName || firstName;

  const [handleAttend, { loading: mutationLoading }] = useMutation(
    ATTEND_MEETING
  );

  const join = async (meetingId, passcode, id) => {
    const callAttend = () =>
      moment(date).format('MMDDYYYY') === moment().format('MMDDYYYY') &&
      handleAttend({ variables: { id } });
    callAttend();

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
  // Meeting zak token generated from using the jwt token as auth from jwt zoom app in postman and hitting the https://api.zoom.us/v2/users/{userId}/token?type=zak endpoint

  // const zakTokenRaw = Config.ZOOM_ZAK_TOKEN;

  // const startMeeting = async (meetingId) => {
  //   const zakToken = decodeURIComponent(zakTokenRaw);

  //   // TODO recieve user's details from zoom API? WOUT: webinar user is different
  //   const userId = 'null'; // NOTE: no need for userId when using zakToken
  //   const userType = ZoomBridgeerType;
  //   const zoomToken = 'null'; // NOTE: no need for userId when using zakToken

  //   const zoomAccessToken = zakToken;
  //   // console.warn('zoomAccessToken', zoomAccessToken);

  //   try {
  //     await ZoomBridge.startMeeting(
  //       fullName,
  //       meetingId,
  //       userId,
  //       userType,
  //       zoomAccessToken,
  //       zoomToken
  //     );
  //   } catch (e) {
  //     throw e;
  //   }
  // };

  return (
    <Cell>
      {!isEmpty(parentVideoCall) ? (
        <CellItem first>
          <Button
            onPress={() =>
              join(parentVideoCall.meetingId, parentVideoCall.passcode, groupId)
            }
            loading={isLoading || mutationLoading}
            title={parentVideoCall.labelText || 'Join Meeting'}
            type={'primary'}
            pill={false}
          />
        </CellItem>
      ) : null}
      {!isEmpty(videoCall) ? (
        <CellItem>
          <Button
            onPress={() =>
              join(videoCall.meetingId, videoCall.passcode, groupId)
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
    meetingId: PropTypes.string,
    passcode: PropTypes.string,
    labelText: PropTypes.string,
  }),
  videoCall: PropTypes.shape({
    meetingId: PropTypes.string,
    passcode: PropTypes.string,
    labelText: PropTypes.string,
  }),
  groupId: PropTypes.string,
  isLoading: PropTypes.bool,
};

export default VideoCall;
