/**
 * Actions.js
 *
 * Author: Caleb Panza
 * Created: Mar 29, 2021
 *
 * Group of actions for a group including "check in", "join video", and "chat"
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import Color from 'color';
import { isEmpty } from 'lodash';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import { AnalyticsConsumer } from '@apollosproject/ui-analytics';

import {
  InlineActivityIndicator,
  ThemeMixin,
  withTheme,
  PaddedView,
} from '@apollosproject/ui-kit';
import ActionBar, { ActionBarItem } from 'ui/ActionBar';
import { useStreamChat } from '../../stream-chat/context';
import { useCheckIn } from '../../check-in';
import ZoomButton from './ZoomButton';

const GET_ACTION_PARTS = gql`
  query getActionParts($id: ID!) {
    node(id: $id) {
      id
      ... on StreamChatChannelNode {
        streamChatChannel {
          id
          channelId
          channelType
        }
      }

      ... on Group {
        videoCall {
          link
          meetingId
          passcode
          labelText
        }
        parentVideoCall {
          link
          meetingId
          passcode
          labelText
        }
      }
    }
  }
`;

const INTERACT_WITH_NODE = gql`
  mutation interactWithNode($nodeId: ID!, $action: InteractionAction!) {
    interactWithNode(nodeId: $nodeId, action: $action) {
      success
    }
  }
`;

const renderChatButton = ({ id, channelId, name, navigation, theme }) => {
  const handlePress = () => {
    // todo : temporary hack until we can get the OverlayProvider working correctly
    navigation.goBack(null);
    navigation.navigate('ChatChannelSingle', {
      itemTitle: name,
    });
  };

  if (!id || !channelId) return null;

  const themeOverride = {
    colors: {
      primary: theme.colors.warning,
    },
  };

  return (
    <ThemeMixin mixin={themeOverride}>
      <ActionBarItem
        label="Message Group"
        icon="chat-conversation"
        onPress={handlePress}
      />
    </ThemeMixin>
  );
};

const renderZoomButton = ({ id, videoCall, theme, isLoading, onJoin }) => {
  if (isEmpty(videoCall)) {
    return null;
  }

  return (
    <ThemeMixin mixin={theme}>
      <ZoomButton
        groupId={id}
        videoCall={videoCall}
        isLoading={isLoading}
        onJoin={onJoin}
      />
    </ThemeMixin>
  );
};

const renderCheckInButton = ({
  id,
  videoCall,
  parentVideoCall,
  theme,
  loading,
  options,
  checkInCompleted,
  checkInCurrentUser,
  onCheckIn,
}) => {
  if (!id || videoCall || parentVideoCall) {
    return null;
  }

  const themeOverride = {
    colors: {
      primary:
        checkInCompleted || loading
          ? Color(theme.colors.success)
              .lighten(0.75)
              .hex()
          : theme.colors.success,
    },
  };

  const label = checkInCompleted ? 'Checked In' : 'Check In';
  const onPress = () => {
    onCheckIn();
    if (!loading && !checkInCompleted && options.length) {
      checkInCurrentUser({
        optionIds: options.map(({ id: optionId }) => optionId),
      });
    }
  };

  return (
    <ThemeMixin mixin={themeOverride}>
      <ActionBarItem
        label={label}
        icon="check"
        onPress={onPress}
        isLoading={loading}
      />
    </ThemeMixin>
  );
};

const Actions = ({ id, name, theme }) => {
  // Hooks
  const navigation = useNavigation();
  const { setChannel } = useStreamChat();
  const {
    loading: checkInLoading,
    options,
    checkInCompleted,
    checkInCurrentUser,
  } = useCheckIn({ nodeId: id });

  // Queries & Mutations
  const [getActionParts, { data, loading, called }] = useLazyQuery(
    GET_ACTION_PARTS
  );
  const [interactWithNode] = useMutation(INTERACT_WITH_NODE);

  // Variables
  const streamChat = data?.node?.streamChatChannel;
  const videoCall = data?.node?.videoCall;
  const parentVideoCall = data?.node?.parentVideoCall;
  const interactWithCheckIn = () =>
    interactWithNode({
      variables: {
        nodeId: id,
        action: 'GROUP_CHECK_IN',
      },
    });
  const interactWithVideo = () =>
    interactWithNode({
      variables: {
        nodeId: id,
        action: 'GROUP_JOINED_VIDEO',
      },
    });
  const interactWithParentVideo = () =>
    interactWithNode({
      variables: {
        nodeId: id,
        action: 'GROUP_JOINED_PARENT_VIDEO',
      },
    });

  useEffect(
    () => {
      if (!loading && id && !isEmpty(id) && !called) {
        getActionParts({
          fetchPolicy: 'network-only',
          variables: {
            id,
          },
        });

        if (setChannel && streamChat?.channelId && streamChat?.channelType) {
          setChannel({
            channelId: streamChat.channelId,
            channelType: streamChat.channelType,
          });
        }
      }
    },
    [id]
  );

  if (!id || (!data && loading)) {
    return (
      <ActionBar>
        <PaddedView>
          <InlineActivityIndicator />
        </PaddedView>
      </ActionBar>
    );
  }

  return (
    <ActionBar>
      {/* Check In Button */}
      {renderCheckInButton({
        id,
        videoCall,
        parentVideoCall,
        theme,
        loading: checkInLoading,
        options,
        checkInCompleted,
        checkInCurrentUser,
        onCheckIn: interactWithCheckIn,
      })}

      {/* Parent Video Button
        * // note : should trigger interaction on press
          // ActionBarItem.js for example
          // Interaction Node: GroupId
          // Interaction: JOINED_PARENT_VIDEO
        */}
      {renderZoomButton({
        id,
        videoCall: parentVideoCall,
        theme: {
          colors: {
            primary: theme.colors.alert,
          },
        },
        onJoin: interactWithParentVideo,
      })}

      {/* Main Video Button
        * // note : should trigger check in on press
        */}
      {renderZoomButton({
        id,
        videoCall: isEmpty(videoCall)
          ? videoCall
          : {
              ...videoCall,
              labelText:
                videoCall?.labelText ||
                (!isEmpty(parentVideoCall) ? 'Join Breakout' : 'Join Meeting'),
            },
        theme: {
          colors: {
            primary: theme.colors.success,
          },
        },
        onJoin: () => {
          interactWithCheckIn();
          interactWithVideo();
          if (options.length > 0) {
            checkInCurrentUser({
              optionIds: options.map((option) => option.id),
            });
          }
        },
      })}

      {/* Chat Button */}
      {renderChatButton({
        ...streamChat,
        groupId: id,
        name,
        theme,
        navigation,
      })}
    </ActionBar>
  );
};

Actions.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  theme: PropTypes.shape({
    colors: PropTypes.shape({
      primary: PropTypes.string,
      secondary: PropTypes.string,
      tertiary: PropTypes.string,
      alert: PropTypes.string,
      success: PropTypes.string,
    }),
  }),
};
Actions.defaultProps = {
  id: null,
  name: 'My Group',
  theme: {},
};

export default withTheme()(Actions);
