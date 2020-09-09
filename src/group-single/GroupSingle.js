import React, { PureComponent } from 'react';
import { Animated, View } from 'react-native';
import { Query } from 'react-apollo';
import PropTypes from 'prop-types';
import { get, head, isEmpty } from 'lodash';

import {
  styled,
  GradientOverlayImage,
  BackgroundView,
  PaddedView,
  H3,
  H4,
  H5,
  BodyText,
  ConnectedImage,
  HorizontalTileFeed,
  BodySmall,
  Icon,
  ThemeConsumer,
  // StretchyView,
  withTheme,
  ThemeMixin,
  ErrorCard,
} from '@apollosproject/ui-kit';

import AvatarCloud from '../ui/AvatarCloud';

import NavigationHeader from '../content-single/NavigationHeader';
import AddCalEventButton from '../content-single/AddCalEventButton';
import MessagesButton from '../content-single/MessagesButton';

import VideoCall from './VideoCall';
import Resources from './Resources';
import CheckInConnected from './CheckIn';

import GET_GROUP from './getGroup';

const FlexedScrollView = styled(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.screen, // fixes the gradient on `GradientOverlayImage` not lining up with the `BackgroundView` and leaving a white overscroll
}))(Animated.ScrollView);

// TODO : temp fix until Core resolves the bug where images would disappear when pulling down
const StretchyView = ({ children, ...props }) =>
  children({ Stretchy: View, ...props });

const MemberCard = styled(({ theme }) => ({
  width: 80,
  flex: 1,
  margin: theme.sizing.baseUnit / 2,
  marginBottom: theme.sizing.baseUnit * 0.75,
  alignItems: 'center',
}))(View);

const MemberImage = styled({
  borderRadius: 10,
  width: 80,
  height: 100,
})(ConnectedImage);

const MemberImageWrapper = styled({
  borderRadius: 10,
  width: 80,
  height: 100,
  overflow: 'hidden',
  justifyContent: 'center',
  alignItems: 'center',
})(View);

const Schedule = styled(({ theme }) => ({
  color: theme.colors.darkPrimary,
}))(BodySmall);

const ScheduleView = styled(() => ({
  flexDirection: 'row',
}))(View);

const IconView = styled({
  paddingRight: 6,
})(View);

const StyledAvatarCloud = styled({
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 100,
  top: 40,
})(AvatarCloud);

const StyledTitle = styled(({ theme }) => ({
  alignItems: 'center',
  justifyContent: 'center',
  position: 'absolute',
  left: 20,
  right: 20,
  bottom: 20,
  paddingHorizontal: theme.sizing.baseUnit * 2,
}))(View);

const StyledH3 = styled({
  textAlign: 'center',
})(H3);

const StyledH4 = styled(({ theme }) => ({
  paddingBottom: theme.sizing.baseUnit,
}))(H4);

const StyledH5 = styled(({ theme }) => ({
  color: theme.colors.darkTertiary,
  textAlign: 'center',
}))(H5);

const StyledHorizontalTileFeed = withTheme(({ theme }) => ({
  style: {
    marginTop: theme.sizing.baseUnit * -1.25,
    paddingBottom: theme.sizing.baseUnit,
    zIndex: 1,
  },
  snapToInterval: 80 + theme.sizing.baseUnit,
}))(HorizontalTileFeed);

const PlaceholderIcon = withTheme(({ theme: { colors } = {} }) => ({
  fill: colors.paper,
  name: 'avatarPlacholder',
  size: 60,
}))(Icon);

const PlaceholderWrapper = styled(({ theme }) => ({
  borderRadius: 10,
  width: 80,
  height: 100,
  backgroundColor: theme.colors.lightSecondary,
  justifyContent: 'center',
  alignItems: 'center',
}))(View);

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

const loadingStateObject = {
  id: 'fake_id',
  title: '',
  coverImage: [],
};

class GroupSingle extends PureComponent {
  static propTypes = {
    content: PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
      summary: PropTypes.string,
      members: PropTypes.shape({}),
      schedule: PropTypes.shape({
        friendlyScheduleText: PropTypes.string,
      }),
      avatars: PropTypes.arrayOf(PropTypes.string),
      groupType: PropTypes.string,
    }),
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
      navigate: PropTypes.func,
    }),
  };

  static navigationOptions = {
    header: NavigationHeader,
    headerTransparent: true,
    headerMode: 'float',
  };

  get itemId() {
    return this.props.navigation.getParam('itemId', []);
  }

  get queryVariables() {
    return { itemId: this.itemId };
  }

  renderMember = ({ item, isLoading }) => {
    const photo = get(item, 'photo', {});
    const name = get(item, 'firstName', '');
    return (
      <MemberCard>
        {!isLoading && photo && photo.uri ? (
          <MemberImageWrapper>
            <MemberImage // eslint-disable-line react-native/no-inline-styles
              source={photo}
              minAspectRatio={1}
              maxAspectRatio={1}
              // Sets the ratio of the placeholder
              forceRatio={1}
              // No ratios are respected without this
              maintainAspectRatio
            />
          </MemberImageWrapper>
        ) : (
            <PlaceholderWrapper>
              <PlaceholderIcon isLoading={false} />
            </PlaceholderWrapper>
          )}

        <BodyText>{name}</BodyText>
      </MemberCard>
    );
  };

  renderContent = ({ content, loading }) => {
    const leader = head(get(content, 'leaders', []));
    const leaderPhoto = get(leader, 'photo', {});
    const coverImageSources = get(content, 'coverImage.sources', []);
    const resources = get(content, 'groupResources', []);
    const dateTime = get(content, 'dateTime', {});
    const videoCall = get(content, 'videoCall', {});
    const parentVideoCall = get(content, 'parentVideoCall', {});
    const phoneNumbers = get(content, 'phoneNumbers', []);
    const allowMessages = get(content, 'allowMessages', '');
    const avatars = get(content, 'avatars', []);

    const getNotes = () => {
      const hasParentVideoCall = parentVideoCall && parentVideoCall.link;
      const hasVideoCall = videoCall && videoCall.link;

      if (!hasParentVideoCall && !hasVideoCall) return null;

      const videoCallNote = hasVideoCall ? videoCall.link : '';
      const parentVideoCallNote = hasParentVideoCall
        ? parentVideoCall.link
        : '';
      const notes = `${
        hasParentVideoCall
          ? `Join Zoom Meeting:\n${parentVideoCallNote}\n\n`
          : ''
        }Join Zoom ${
        hasParentVideoCall ? 'Breakout' : ''
        }Meeting:\n${videoCallNote}`;
      return notes.trim();
    };

    const { start } = dateTime;

    return (
      <ThemeConsumer>
        {(theme) => (
          <StretchyView>
            {({ Stretchy, ...scrollViewProps }) => (
              <FlexedScrollView {...scrollViewProps}>
                <Stretchy>
                  <GradientOverlayImage
                    isLoading={!coverImageSources.length || loading}
                    source={coverImageSources}
                    // Sets the ratio of the image
                    minAspectRatio={1}
                    maxAspectRatio={1}
                    // Sets the ratio of the placeholder
                    forceRatio={1}
                    // No ratios are respected without this
                    maintainAspectRatio
                    overlayColor={theme.colors.paper}
                    overlayType="featured"
                  />

                  <StyledAvatarCloud
                    avatars={avatars}
                    primaryAvatar={leaderPhoto.uri ? leaderPhoto : null}
                    isLoading={!avatars && loading}
                  />
                  <StyledTitle>
                    <StyledH3 isLoading={loading} numberOfLines={2}>
                      {content.title}
                    </StyledH3>
                    <StyledH5 isLoading={loading} numberOfLines={2}>
                      {content.groupType}
                    </StyledH5>
                  </StyledTitle>
                </Stretchy>

                <BackgroundView>
                  <PaddedView vertical={false}>
                    <Cell>
                      {content.schedule ? (
                        <CellItem first>
                          <ScheduleView>
                            <IconView>
                              <Icon isLoading={loading} name="time" size={16} />
                            </IconView>
                            <Schedule
                              numberOfLines={1}
                              isLoading={
                                !content.schedule.friendlyScheduleText &&
                                loading
                              }
                            >
                              {content.schedule.friendlyScheduleText}
                            </Schedule>
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
                      <BodyText isLoading={!content.summary && loading}>
                        {content.summary}
                      </BodyText>
                    </PaddedView>

                    {videoCall ? (
                      <VideoCall
                        groupId={content.id}
                        isLoading={loading}
                        parentVideoCall={parentVideoCall}
                        videoCall={videoCall}
                      />
                    ) : (
                        <CheckInConnected
                          id={content.id}
                          isLoading={loading}
                          date={start}
                        />
                      )}

                    <StyledH4 padded>{'Group Members'}</StyledH4>
                  </PaddedView>
                  <StyledHorizontalTileFeed
                    content={content.members}
                    isLoading={!content.members && loading}
                    loadingStateObject={loadingStateObject}
                    renderItem={this.renderMember}
                  />

                  {phoneNumbers && allowMessages === 'True' ? (
                    <PaddedView>
                      <MessagesButton recipients={phoneNumbers} />
                    </PaddedView>
                  ) : null}

                  {!isEmpty(resources) ? (
                    <Resources
                      isLoading={loading}
                      navigation={this.props.navigation}
                      resources={resources}
                    />
                  ) : null}
                </BackgroundView>
              </FlexedScrollView>
            )}
          </StretchyView>
        )}
      </ThemeConsumer>
    );
  };

  renderWithData = ({ data, error, loading }) => {
    if (error) return <ErrorCard error={error} />;

    const content = get(data, 'node', {});
    const { theme = {} } = content;
    return (
      <ThemeMixin theme={theme}>
        {this.renderContent({ content, loading, error })}
      </ThemeMixin>
    );
  };

  render() {
    return (
      <Query
        query={GET_GROUP}
        variables={this.queryVariables}
        fetchPolicy="cache-and-network"
      >
        {this.renderWithData}
      </Query>
    );
  }
}

export default GroupSingle;
