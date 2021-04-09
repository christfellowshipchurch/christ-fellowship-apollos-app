import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { get, isEmpty } from 'lodash';

import {
  styled,
  PaddedView,
  Icon,
  withTheme,
  ImageSourceType,
} from '@apollosproject/ui-kit';

import DateLabel from '../../ui/DateLabel';

import AddCalEventButton from '../../content-single/AddCalEventButton';

import CoverImageBackground from '../CoverImageBackground';
import Resources from '../Resources';
import { HorizontalMembersFeedPreview } from '../MembersFeed';
import HeaderConnected from '../HeaderConnected';
import SummaryConnected from '../SummaryConnected';
import Actions from './Actions';

const BackgroundView = styled(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.background.screen,
}))(View);

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

const Group = ({ id, content, loading }) => {
  const navigation = useNavigation();

  const coverImageSources = get(content, 'coverImage.sources', []);
  const resources = get(content, 'resources', []);
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

  const handleEditGroupPress = () => navigation.navigate('EditGroup', { id });

  return (
    <CoverImageBackground isLoading={loading} source={coverImageSources}>
      <HeaderConnected id={id} onEditGroupPress={handleEditGroupPress} />

      <BackgroundView>
        <PaddedView vertical={false}>
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
        </PaddedView>

        <PaddedView horizontal={false}>
          <Actions id={id} />
        </PaddedView>

        <PaddedView vertical={false}>
          <SummaryConnected id={id} />
        </PaddedView>

        <HorizontalMembersFeedPreview id={id} />

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
    dateTime: PropTypes.shape({
      state: PropTypes.string,
      end: PropTypes.string,
    }),
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
