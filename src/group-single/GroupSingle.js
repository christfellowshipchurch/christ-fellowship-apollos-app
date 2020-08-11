import React, { useEffect } from 'react';
import { Animated, View } from 'react-native';
import { Query } from 'react-apollo';
import PropTypes from 'prop-types';
import { get, head, isEmpty } from 'lodash';
import { compose } from 'recompose';
import ZoomBridge from 'react-native-zoom-bridge';
import Config from 'react-native-config';
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

import { useCurrentUser, useLinkRouter } from '../hooks';

import AvatarCloud from '../ui/AvatarCloud';

import NavigationHeader from '../content-single/NavigationHeader';
import AddCalEventButton from '../content-single/AddCalEventButton';

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

const ScheduleView = styled(({ theme }) => ({
  flexDirection: 'row',
  paddingTop: theme.sizing.baseUnit,
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
  paddingHorizontal: theme.sizing.baseUnit,
  flexDirection: 'row',
  justifyContent: 'flex-start',
}))(View);

const CellItem = styled(({ theme, first }) => ({
  marginRight: first ? theme.sizing.baseUnit : 0,
  flex: 1,
}))(View);

const ZoomBridgeerType = 2; // 2 - pro user
const config = {
  zoom: {
    appKey: Config.ZOOM_SDK_APP_KEY, // SDK key created in Zoom app marketplace
    appSecret: Config.ZOOM_SDK_APP_SECRET, // SDK secret created in Zoom app marketplace
    domain: 'zoom.us',
  },
};

const GroupSingle = ({ navigation }) => {
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

  const { routeLink } = useLinkRouter();
  const loadingStateObject = {
    id: 'fake_id',
    title: '',
    coverImage: [],
  };

  const zakTokenRaw = Config.ZOOM_ZAK_TOKEN; // Meeting zak token generated from using the jwt token as auth from jwt zoom app in postman and hitting the https://api.zoom.us/v2/users/{userId}/token?type=zak endpoint

  const itemId = navigation.getParam('itemId', []);
  const queryVariables = { itemId };

  const { firstName, lastName } = useCurrentUser();
  const fullName = `${firstName} ${lastName}`;

  const startMeeting = async (meetingId) => {
    const zakToken = decodeURIComponent(zakTokenRaw);

    // TODO recieve user's details from zoom API? WOUT: webinar user is different
    const userId = 'null'; // NOTE: no need for userId when using zakToken
    const userType = ZoomBridgeerType;
    const zoomToken = 'null'; // NOTE: no need for userId when using zakToken

    const zoomAccessToken = zakToken;
    // console.warn('zoomAccessToken', zoomAccessToken);

    try {
      await ZoomBridge.startMeeting(
        fullName,
        meetingId,
        userId,
        userType,
        zoomAccessToken,
        zoomToken
      );
    } catch (e) {
      throw e;
    }
  };

  const join = async (meetingId, passcode) => {
    try {
      if (passcode) {
        await ZoomBridge.joinMeetingWithPassword(fullName, meetingId, passcode);
      } else {
        await ZoomBridge.joinMeeting(fullName, meetingId);
      }
    } catch (e) {
      throw e;
    }
  };

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
    const zoom = get(content, 'zoom', {});
    const { start } = dateTime;
    return (
      <ThemeConsumer>
        {(theme) => (
          <BackgroundView>
            <StretchyView>
              {({ Stretchy, ...scrollViewProps }) => (
                <FlexedScrollView {...scrollViewProps}>
                  {coverImageSources.length ? (
                    <Stretchy>
                      <GradientOverlayImage
                        isLoading={!coverImageSources.length}
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
                        avatars={content.avatars}
                        primaryAvatar={leaderPhoto.uri ? leaderPhoto : null}
                      />
                      <StyledTitle>
                        <StyledH3 numberOfLines={2}>{content.title}</StyledH3>
                        <StyledH5 numberOfLines={2}>
                          {content.groupType}
                        </StyledH5>
                      </StyledTitle>
                    </Stretchy>
                  ) : null}

                  <PaddedView vertical={false}>
                    {start ? (
                      <AddCalEventButton
                        eventTitle={content.title}
                        eventStart={start}
                        eventNotes={!isEmpty(zoom) ? zoom.link : null}
                        isLoading={loading}
                      />
                    ) : null}
                    {content.schedule ? (
                      <ScheduleView>
                        <IconView>
                          <Icon name="time" size={16} />
                        </IconView>
                        <Schedule numberOfLines={1}>
                          {content.schedule.friendlyScheduleText}
                        </Schedule>
                      </ScheduleView>
                    ) : null}
                    <PaddedView horizontal={false}>
                      <BodyText>{content.summary}</BodyText>
                    </PaddedView>

                    <StyledH4>{'Group Members'}</StyledH4>
                    <StyledHorizontalTileFeed
                      content={content.members}
                      renderItem={renderMember}
                      loadingStateObject={loadingStateObject}
                      isLoading={loading}
                    />
                  </PaddedView>
                  {!isEmpty(zoom) ? (
                    <Cell>
                      <CellItem first>
                        <Button
                          onPress={() => join(zoom.meetingId, zoom.passcode)}
                          loading={loading}
                          title={'Join Video Call'}
                          type={'primary'}
                          pill={false}
                        />
                      </CellItem>
                      <CellItem>
                        <Button
                          onPress={() => startMeeting(zoom.meetingId)}
                          loading={loading}
                          title={'Start Video Call'}
                          type={'primary'}
                          pill={false}
                        />
                      </CellItem>
                    </Cell>
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

  const renderWithData = ({ loading, error, data }) => {
    if (error) return <ErrorCard error={error} />;

    const content = get(data, 'node', {});
    const { theme = {} } = content;
    console.log('content', content);
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
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
    push: PropTypes.func,
  }),
};

GroupSingle.navigationOptions = {
  header: NavigationHeader,
  headerTransparent: true,
  headerMode: 'float',
};

export default GroupSingle;
