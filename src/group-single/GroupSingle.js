import React from 'react';
import { Animated, View } from 'react-native';
import { Query } from 'react-apollo';
import PropTypes from 'prop-types';
import { get, head, isEmpty } from 'lodash';
import { compose } from 'recompose';
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
  Button,
} from '@apollosproject/ui-kit';

import { useLinkRouter } from '../hooks';

import AvatarCloud from '../ui/AvatarCloud';

import NavigationHeader from '../content-single/NavigationHeader';
import AddCalEventButton from '../content-single/AddCalEventButton';
import MessagesButton from '../content-single/MessagesButton';

import VideoCall from './VideoCall';

import GET_GROUP from './getGroup';

const FlexedScrollView = styled({ flex: 1 })(Animated.ScrollView);

// TODO : temp fix until Core resolves the bug where images would disappear when pulling down
const StretchyView = ({ children, ...props }) =>
  children({ Stretchy: View, ...props });

const MemberCard = styled(({ theme, forceRatio }) => ({
  width: 80,
  flex: 1,
  margin: theme.sizing.baseUnit / 2,
  marginBottom: theme.sizing.baseUnit * 0.75,
  ...(forceRatio ? { aspectRatio: forceRatio } : {}),
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

const StyledButton = styled(({ theme }) => ({
  marginBottom: theme.sizing.baseUnit * 0.5,
  backgroundColor: 'rgba(120, 120, 128, 0.36)',
  borderColor: 'rgba(120, 120, 128, 0)',
}))(Button);

const StyledButtonText = styled(({ theme }) => ({
  color: '#FFF',
}))(H4);

const StyledHorizontalTileFeed = styled(({ theme }) => ({
  /* UX hack to improve tapability. The magic number below happens to be the number of pixels that
   * aligns everything in the same place as if none of the UX hacks were there. */
  marginTop: theme.sizing.baseUnit * -1.25,
  paddingBottom: theme.sizing.baseUnit,
  zIndex: 1,
}))(HorizontalTileFeed);

const PlaceholderIcon = compose(
  withTheme(({ theme: { colors } = {} }) => ({
    fill: colors.paper,
    name: 'avatarPlacholder',
    size: 60,
  }))
)(Icon);

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

const GroupSingle = ({ navigation }) => {
  const { routeLink } = useLinkRouter();
  const loadingStateObject = {
    id: 'fake_id',
    title: '',
    coverImage: [],
  };

  const itemId = navigation.getParam('itemId', []);
  const queryVariables = { itemId };

  const renderMember = ({ item, isLoading }) => {
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

  const renderContent = ({ content, loading, error }) => {
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

    const { start } = dateTime;
    return (
      <ThemeConsumer>
        {(theme) => (
          <BackgroundView>
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
                      overlayColor={theme.colors.white}
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
                            eventTitle={content.title}
                            eventStart={start}
                            eventNotes={
                              !isEmpty(videoCall) ? videoCall.link : null
                            }
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

                    <VideoCall
                      parentVideoCall={parentVideoCall}
                      videoCall={videoCall}
                      isLoading={loading}
                      groupId={content.id}
                    />

                    <StyledH4>{'Group Members'}</StyledH4>
                    <StyledHorizontalTileFeed
                      content={content.members}
                      renderItem={renderMember}
                      loadingStateObject={loadingStateObject}
                      isLoading={!content.members && loading}
                    />
                  </PaddedView>

                  {phoneNumbers && allowMessages === 'True' ? (
                    <PaddedView>
                      <MessagesButton recipients={phoneNumbers} />
                    </PaddedView>
                  ) : null}

                  {!isEmpty(resources) ? (
                    <PaddedView>
                      <StyledH4>{'Resources'}</StyledH4>
                      {resources.map((item) => {
                        const handleOnPress = () => {
                          if (item.contentChannelItem) {
                            navigation.navigate('ContentSingle', {
                              itemId: item.contentChannelItem,
                            });
                          }
                          return routeLink(item.url);
                        };
                        return (
                          <StyledButton
                            onPress={() => handleOnPress()}
                            type={'default'}
                            loading={loading}
                            pill={false}
                          >
                            <StyledButtonText>{item.title}</StyledButtonText>
                          </StyledButton>
                        );
                      })}
                    </PaddedView>
                  ) : null}
                </FlexedScrollView>
              )}
            </StretchyView>
          </BackgroundView>
        )}
      </ThemeConsumer>
    );
  };

  const renderWithData = ({ data, error, loading }) => {
    if (error) return <ErrorCard error={error} />;

    const content = get(data, 'node', {});
    const { theme = {} } = content;
    return (
      <ThemeMixin theme={theme}>
        {renderContent({ content, loading, error })}
      </ThemeMixin>
    );
  };

  return (
    <Query query={GET_GROUP} variables={queryVariables}>
      {renderWithData}
    </Query>
  );
};

GroupSingle.propTypes = {
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

GroupSingle.navigationOptions = {
  header: NavigationHeader,
  headerTransparent: true,
  headerMode: 'float',
};

export default GroupSingle;
