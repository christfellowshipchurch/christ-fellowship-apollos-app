import React, { useRef } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { get, isEmpty } from 'lodash';

import {
  styled,
  BackgroundView,
  PaddedView,
  Icon,
  withTheme,
  ImageSourceType,
} from '@apollosproject/ui-kit';

import DateLabel from '../../ui/DateLabel';

import AddCalEventButton from '../../content-single/AddCalEventButton';

import CoverImageBackground from '../CoverImageBackground';
import VideoCall from '../VideoCall';
import Resources from '../Resources';
import MembersFeedConnected from '../MembersFeedConnected';
import HeaderConnected from '../HeaderConnected';
import SummaryConnected from '../SummaryConnected';
import { CheckInButtonConnected } from '../../check-in';
import GroupChatButton from '../GroupChatButton';

const ScheduleView = styled(() => ({
  flexDirection: 'row',
  alignItems: 'center',
}))(View);

const IconView = styled({
  paddingRight: 6,
})(View);

const StyledIcon = withTheme(({ theme }) => ({
  fill: theme.colors.text.tertiary,
}))(Icon);

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

const Group = ({ id, content, loading, navigation }) => {
  const checkInRef = useRef();
  const coverImageSources = get(content, 'coverImage.sources', []);
  const resources = get(content, 'groupResources', []);
  const dateTime = get(content, 'dateTime', {});
  const videoCall = get(content, 'videoCall', {});
  const parentVideoCall = get(content, 'parentVideoCall', {});

  const getNotes = () => {
    const hasParentVideoCall = parentVideoCall && parentVideoCall.link;
    const hasVideoCall = videoCall && videoCall.link;

    if (!hasParentVideoCall && !hasVideoCall) return null;

    const videoCallNote = hasVideoCall ? videoCall.link : '';
    const parentVideoCallNote = hasParentVideoCall ? parentVideoCall.link : '';
    const notes = `${
      hasParentVideoCall ? `Join Zoom Meeting:\n${parentVideoCallNote}\n\n` : ''
    }Join Zoom ${
      hasParentVideoCall ? 'Breakout' : ''
    }Meeting:\n${videoCallNote}`;
    return notes.trim();
  };

  const start = get(dateTime, 'start');
  const chatChannelId = get(content, 'streamChatChannel.channelId');

  return (
    <CoverImageBackground isLoading={loading} source={coverImageSources}>
      <HeaderConnected id={id} />

      <BackgroundView>
        <PaddedView vertical={false}>
          {!videoCall && (
            <Cell>
              <CellItem />
              <CellItem>
                <PaddedView horizontal={false}>
                  <CheckInButtonConnected id={id} ref={checkInRef} />
                </PaddedView>
              </CellItem>
              <CellItem />
            </Cell>
          )}

          <Cell>
            {content.dateTime ? (
              <CellItem first>
                <ScheduleView>
                  <IconView>
                    <StyledIcon isLoading={loading} name="time" size={16} />
                  </IconView>
                  <DateLabel
                    withTime
                    isLoading={!start && loading}
                    date={start}
                  />
                </ScheduleView>
              </CellItem>
            ) : null}
            {start ? (
              <CellItem>
                <AddCalEventButton
                  eventNotes={getNotes()}
                  eventStart={start}
                  eventTitle={content.title}
                  isLoading={loading}
                />
              </CellItem>
            ) : null}
          </Cell>

          <PaddedView horizontal={false}>
            {videoCall && (
              <VideoCall
                groupId={content.id}
                isLoading={loading}
                parentVideoCall={parentVideoCall}
                videoCall={videoCall}
                date={start}
              />
            )}

            {chatChannelId && (
              <GroupChatButton
                channelId={chatChannelId}
                groupName={content.title}
              />
            )}
          </PaddedView>

          <SummaryConnected id={id} />
        </PaddedView>

        <MembersFeedConnected id={id} />

        {!isEmpty(resources) ? (
          <Resources
            isLoading={loading}
            navigation={navigation}
            resources={resources}
          />
        ) : null}
      </BackgroundView>
    </CoverImageBackground>
  );
};

Group.propTypes = {
  id: PropTypes.string,
  content: PropTypes.shape({
    __typename: PropTypes.string,
    id: PropTypes.string,
    title: PropTypes.string,
    summary: PropTypes.string,
    groupType: PropTypes.string,
    groupResources: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string,
        action: PropTypes.string,
        relatedNode: PropTypes.shape({ id: PropTypes.string }),
      })
    ),
    coverImage: ImageSourceType,
  }),
  loading: PropTypes.bool,
};

export default Group;
