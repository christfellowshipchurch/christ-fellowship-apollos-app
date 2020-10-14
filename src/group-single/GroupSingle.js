import React, { PureComponent } from 'react';
import { Animated, View, YellowBox } from 'react-native';
import { Query } from 'react-apollo';
import PropTypes from 'prop-types';
import { get, isEmpty } from 'lodash';

import {
  styled,
  GradientOverlayImage,
  BackgroundView,
  PaddedView,
  H3,
  H5,
  BodyText,
  Icon,
  ThemeConsumer,
  // StretchyView,
  withTheme,
  ThemeMixin,
  ErrorCard,
} from '@apollosproject/ui-kit';

import AvatarCloud from '../ui/AvatarCloud';
import DateLabel from '../ui/DateLabel';

import NavigationHeader from '../content-single/NavigationHeader';
import AddCalEventButton from '../content-single/AddCalEventButton';

import VideoCall from './VideoCall';
import Resources from './Resources';
import CheckInConnected from './CheckIn';
import GroupChatButton from './GroupChatButton';
import MembersFeedConnected from './MembersFeedConnected';

import GET_GROUP from './getGroup';

YellowBox.ignoreWarnings([
  'Warning: Failed prop type',
  'Warning: componentWillReceiveProps',
  'Warning: componentWillMount',
  'Warning: Failed child context',
  'Warning: Failed context type',
  'Warning: Async Storage',
  'Warning: "getContext',
]);

const FlexedScrollView = styled(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.screen, // fixes the gradient on `GradientOverlayImage` not lining up with the `BackgroundView` and leaving a white overscroll
}))(Animated.ScrollView);

// TODO : temp fix until Core resolves the bug where images would disappear when pulling down
const StretchyView = ({ children, ...props }) =>
  children({ Stretchy: View, ...props });

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

const StyledAvatarCloud = styled(({ theme }) => ({
  position: 'absolute',
  left: theme.sizing.baseUnit,
  right: theme.sizing.baseUnit,
  bottom: 125, // Magic Number to avoid overlaying title
  top: 40, // Magic Number to avoid overlaying header
}))(AvatarCloud);

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

class GroupSingle extends PureComponent {
  static propTypes = {
    content: PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
      summary: PropTypes.string,
      members: PropTypes.shape({}),
      avatars: PropTypes.arrayOf(PropTypes.string),
      groupType: PropTypes.string,
    }),
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
      navigate: PropTypes.func,
    }),
  };

  get itemId() {
    return this.props.navigation.getParam('itemId', []);
  }

  get queryVariables() {
    return { itemId: this.itemId };
  }

  static navigationOptions = {
    header: NavigationHeader,
    headerTransparent: true,
    headerMode: 'float',
  };

  renderContent = ({ content, loading }) => {
    const typename = get(content, '__typename', []);
    const coverImageSources = get(content, 'coverImage.sources', []);
    const resources = get(content, 'groupResources', []);
    const dateTime = get(content, 'dateTime', {});
    const videoCall = get(content, 'videoCall', {});
    const parentVideoCall = get(content, 'parentVideoCall', {});
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

    const start = get(dateTime, 'start');

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
                      {content.dateTime ? (
                        <CellItem first>
                          <ScheduleView>
                            <IconView>
                              <StyledIcon
                                isLoading={loading}
                                name="time"
                                size={16}
                              />
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
                      <BodyText isLoading={!content.summary && loading}>
                        {content.summary}
                      </BodyText>
                    </PaddedView>

                    {typename === 'Group' && (
                      <View>
                        {videoCall ? (
                          <VideoCall
                            groupId={content.id}
                            isLoading={loading}
                            parentVideoCall={parentVideoCall}
                            videoCall={videoCall}
                            date={start}
                          />
                        ) : (
                          <CheckInConnected
                            id={content.id}
                            isLoading={loading}
                            date={start}
                          />
                        )}
                        <GroupChatButton />
                      </View>
                    )}
                  </PaddedView>

                  <MembersFeedConnected id={this.itemId} />

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
    console.log('[rkd] Group content:', content);

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
