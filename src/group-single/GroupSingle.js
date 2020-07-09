import React, { PureComponent } from 'react';
import { Animated, View } from 'react-native';
import { Query } from 'react-apollo';
import PropTypes from 'prop-types';
import { get, head } from 'lodash';
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
  // StretchyView,
  withTheme,
  ThemeMixin,
  ErrorCard,
} from '@apollosproject/ui-kit';

import AvatarCloud from '../ui/AvatarCloud';

import NavigationHeader from '../content-single/NavigationHeader';

import GET_GROUP from './getGroup';

const FlexedScrollView = styled({ flex: 1 })(Animated.ScrollView);

// TODO : temp fix until Core resolves the bug where images would disappear when pulling down
const StretchyView = ({ children, ...props }) =>
  children({ Stretchy: View, ...props });

const MemberCard = styled(({ theme, forceRatio }) => ({
  width: 100,
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
  bottom: 0,
  top: 0,
})(AvatarCloud);

const StyledHorizontalTileFeed = styled(({ theme }) => ({
  /* UX hack to improve tapability. The magic number below happens to be the number of pixels that
   * aligns everything in the same place as if none of the UX hacks were there. */
  marginTop: theme.sizing.baseUnit * -1.25,
  paddingBottom: theme.sizing.baseUnit,
  zIndex: 1,
}))(HorizontalTileFeed);

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

  get itemId() {
    return this.props.navigation.getParam('itemId', []);
  }

  get avatars() {
    return this.props.navigation.getParam('avatars', []);
  }

  get queryVariables() {
    return { itemId: this.itemId };
  }

  renderMember = ({ item }) => {
    const photo = get(item, 'photo', { uri: 'https://picsum.photos/200' });
    const name = get(item, 'firstName', '');
    return (
      <MemberCard forceRatio={1}>
        <MemberImage // eslint-disable-line react-native/no-inline-styles
          source={photo}
          minAspectRatio={1}
          maxAspectRatio={1}
          // Sets the ratio of the placeholder
          forceRatio={1}
          // No ratios are respected without this
          maintainAspectRatio
        />
        <BodyText>{name}</BodyText>
      </MemberCard>
    );
  };

  renderContent = ({ content, loading, error }) => {
    const leader = head(get(content, 'leaders', []));
    const leaderPhoto = get(leader, 'photo', {});
    return (
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
                  />
                  <StyledAvatarCloud
                    avatars={this.avatars}
                    primaryAvatar={leaderPhoto || 'https://picsum.photos/200'}
                  />
                </Stretchy>
              ) : null}
              <PaddedView>
                <H3>{content.title}</H3>
                {content.schedule ? (
                  <ScheduleView>
                    <IconView>
                      <Icon name="time" size={16} />
                    </IconView>
                    <Schedule numberOfLines={1}>{content.schedule}</Schedule>
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
