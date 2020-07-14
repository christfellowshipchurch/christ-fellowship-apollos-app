import React, { PureComponent } from 'react';
import { Animated, View } from 'react-native';
import { Query } from 'react-apollo';
import PropTypes from 'prop-types';
import { get, head } from 'lodash';
import { compose } from 'recompose';
import ZoomBridge from 'react-native-zoom-bridge';
import {
  styled,
  GradientOverlayImage,
  BackgroundView,
  PaddedView,
  H3,
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

import AvatarCloud from '../ui/AvatarCloud';

import NavigationHeader from '../content-single/NavigationHeader';

import GET_GROUP from './getGroup';

const FlexedScrollView = styled({ flex: 1 })(Animated.ScrollView);

// TODO : temp fix until Core resolves the bug where images would disappear when pulling down
const StretchyView = ({ children, ...props }) =>
  children({ Stretchy: View, ...props });

const MemberCard = styled(({ theme, forceRatio }) => ({
  width: 80,
  margin: theme.sizing.baseUnit / 2,
  marginBottom: theme.sizing.baseUnit * 0.75,
  ...(forceRatio ? { aspectRatio: forceRatio } : {}),
  alignItems: 'center',
  flex: 1,
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

const StyledH5 = styled(({ theme }) => ({
  color: theme.colors.darkTertiary,
  textAlign: 'center',
}))(H5);

const StyledHorizontalTileFeed = styled(({ theme }) => ({
  /* UX hack to improve tapability. The magic number below happens to be the number of pixels that
   * aligns everything in the same place as if none of the UX hacks were there. */
  marginTop: theme.sizing.baseUnit * -1.25,
  paddingBottom: theme.sizing.baseUnit,
  zIndex: 1,
}))(HorizontalTileFeed);

const PlaceholderIcon = compose(
  withTheme(({ theme: { colors, sizing } = {} }) => ({
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

const ZoomBridgeerType = 2; // 2 - pro user
const config = {
  zoom: {
    appKey: '', // TODO: appKey
    appSecret: '', // TODO appSecret
    domain: 'zoom.us',
  },
};

class GroupSingle extends PureComponent {
  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
      push: PropTypes.func,
    }),
  };

  static navigationOptions = {
    header: NavigationHeader,
    headerTransparent: true,
    headerMode: 'float',
  };

  coverImageSources = [
    {
      uri: 'https://picsum.photos/800',
    },
  ];

  loadingStateObject = {
    id: 'fake_id',
    title: '',
    coverImage: [],
  };

  zakTokenRaw = ''; // TODO: meeting zak

  meetingNo = ''; // TODO: meeting number

  async componentDidMount() {
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

  get itemId() {
    return this.props.navigation.getParam('itemId', []);
  }

  get avatars() {
    return this.props.navigation.getParam('avatars', []);
  }

  get queryVariables() {
    return { itemId: this.itemId };
  }

  async start() {
    const zakToken = decodeURIComponent(this.zakTokenRaw);
    const displayName = 'Test mentor';

    // TODO recieve user's details from zoom API? WOUT: webinar user is different
    const userId = 'null'; // NOTE: no need for userId when using zakToken
    const userType = ZoomBridgeerType;
    const zoomToken = 'null'; // NOTE: no need for userId when using zakToken

    const zoomAccessToken = zakToken;

    try {
      await ZoomBridge.startMeeting(
        displayName,
        this.meetingNo,
        userId,
        userType,
        zoomAccessToken,
        zoomToken
      );
    } catch (e) {
      throw e;
    }
  }

  async join() {
    const displayName = 'Test Person';
    const password = ''; // TODO: meeting password
    try {
      await ZoomBridge.joinMeetingWithPassword(
        displayName,
        this.meetingNo,
        password
      );
    } catch (e) {
      throw e;
    }
  }

  renderMember = ({ item, isLoading }) => {
    const photo = get(item, 'photo', {});
    const name = get(item, 'firstName', '');
    return (
      <MemberCard forceRatio={1}>
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

  renderContent = ({ content, loading, error }) => {
    const leader = head(get(content, 'leaders', []));
    const leaderPhoto = get(leader, 'photo', {});
    return (
      <ThemeConsumer>
        {(theme) => (
          <BackgroundView>
            <StretchyView>
              {({ Stretchy, ...scrollViewProps }) => (
                <FlexedScrollView {...scrollViewProps}>
                  {this.coverImageSources.length ? (
                    <Stretchy>
                      <GradientOverlayImage
                        isLoading={!this.coverImageSources.length}
                        source={this.coverImageSources}
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
                        avatars={this.avatars}
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
                  <PaddedView>
                    <Button
                      onPress={() => this.join()}
                      loading={loading}
                      title={'Join Video Call'}
                      type={'primary'}
                      pill={false}
                    />
                  </PaddedView>
                  <PaddedView>
                    {content.schedule ? (
                      <ScheduleView>
                        <IconView>
                          <Icon name="time" size={16} />
                        </IconView>
                        <Schedule numberOfLines={1}>
                          {content.schedule}
                        </Schedule>
                      </ScheduleView>
                    ) : null}
                    <PaddedView horizontal={false}>
                      <BodyText>{content.summary}</BodyText>
                    </PaddedView>

                    <H5>{'Group Members'}</H5>
                  </PaddedView>
                  <StyledHorizontalTileFeed
                    content={content.members}
                    renderItem={this.renderMember}
                    loadingStateObject={this.loadingStateObject}
                    isLoading={loading}
                  />
                </FlexedScrollView>
              )}
            </StretchyView>
          </BackgroundView>
        )}
      </ThemeConsumer>
    );
  };

  renderWithData = ({ loading, error, data }) => {
    if (error) return <ErrorCard error={error} />;

    const content = get(data, 'node', {});
    const { theme = {} } = content;
    console.log('content', content);
    return (
      <ThemeMixin theme={theme}>
        {this.renderContent({ content, loading, error })}
      </ThemeMixin>
    );
  };

  render() {
    return (
      <Query query={GET_GROUP} variables={this.queryVariables}>
        {this.renderWithData}
      </Query>
    );
  }
}

export default GroupSingle;
