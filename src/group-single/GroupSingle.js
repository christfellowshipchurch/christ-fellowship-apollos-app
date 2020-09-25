import React, { PureComponent } from 'react';
import { Animated, View } from 'react-native';
import PropTypes from 'prop-types';
import { get, isEmpty } from 'lodash';

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
  Icon,
  withTheme,
  ImageSourceType,
} from '@apollosproject/ui-kit';

import AvatarCloud from '../ui/AvatarCloud';
import DateLabel from '../ui/DateLabel';

import NavigationHeader from '../content-single/NavigationHeader';
import AddCalEventButton from '../content-single/AddCalEventButton';
import MessagesButton from '../content-single/MessagesButton';

import VideoCall from './VideoCall';
import Resources from './Resources';
import CheckInConnected from './CheckIn';

const FlexedScrollView = styled(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.colors.screen, // fixes the gradient on `GradientOverlayImage` not lining up with the `BackgroundView` and leaving a white overscroll
}))(Animated.ScrollView); // TODO: needs refactoring. This is very likely broken as you can't use `styled` with an `Animated` component.

// TODO : check if Apollo core has fixed this. Temp fix until Core resolves the bug where images would disappear when pulling down
const StretchyView = ({ children, ...props }) =>
  children({ Stretchy: View, ...props });

const MemberCard = styled(({ theme }) => ({
  width: 80, // TODO: magic number 🧙‍♂️ I recommend making this a fluid component and letting the `HorizontalTileFeed` control it's size.
  flex: 1,
  margin: theme.sizing.baseUnit / 2,
  marginBottom: theme.sizing.baseUnit * 0.75,
  alignItems: 'center',
}))(View);

const MemberImage = styled(({ theme }) => ({
  borderRadius: theme.sizing.baseBorderRadius * 1.25,
  width: 80, // TODO: magic number 🧙‍♂️
  height: 100, // TODO: magic number 🧙‍♂️
}))(ConnectedImage);

const MemberImageWrapper = styled(({ theme }) => ({
  borderRadius: theme.sizing.baseBorderRadius * 1.25,
  width: 80, // TODO: magic number 🧙‍♂️ I recommend making this a fluid component and letting the `HorizontalTileFeed` control it's size.
  height: 100, // TODO: magic number 🧙‍♂️ I recommend making this a fluid component and letting the `HorizontalTileFeed` control it's size.
  overflow: 'hidden',
  justifyContent: 'center',
  alignItems: 'center',
}))(View);

const ScheduleView = styled(() => ({
  flexDirection: 'row',
  alignItems: 'center',
}))(View);

const IconView = styled({
  paddingRight: 6, // TODO: magic number 🧙‍♂️
})(View);

const StyledIcon = withTheme(({ theme }) => ({
  fill: theme.colors.text.tertiary,
}))(Icon);

const StyledAvatarCloud = styled(({ theme }) => ({
  position: 'absolute',
  left: theme.sizing.baseUnit,
  right: theme.sizing.baseUnit,
  bottom: 125, // TODO: magic number to avoid overlaying title 🧙‍♂️
  top: 40, // TODO: magic number to avoid overlaying header 🧙‍♂️
}))(AvatarCloud);

const StyledTitle = styled(({ theme }) => ({
  alignItems: 'center',
  justifyContent: 'center',
  position: 'absolute',
  left: 20, // TODO: magic number 🧙‍♂️
  right: 20, // TODO: magic number 🧙‍♂️
  bottom: 20, // TODO: magic number 🧙‍♂️
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
    marginTop: theme.sizing.baseUnit * -1.25, // TODO: magic number 🧙This feels like a hack
    paddingBottom: theme.sizing.baseUnit,
    zIndex: 1,
  },
  snapToInterval: 80 + theme.sizing.baseUnit,
}))(HorizontalTileFeed);

const PlaceholderIcon = withTheme(({ theme: { colors } = {} }) => ({
  fill: colors.paper,
  name: 'avatarPlacholder',
  size: 60, // TODO: magic number 🧙
}))(Icon);

const PlaceholderWrapper = styled(({ theme }) => ({
  borderRadius: theme.sizing.baseBorderRadius * 1.25,
  width: 80, // TODO: magic number 🧙‍♂️ I recommend making this a fluid component and letting the `HorizontalTileFeed` control it's size.
  height: 100, // TODO: magic number 🧙‍♂️ I recommend making this a fluid component and letting the `HorizontalTileFeed` control it's size.
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

const CoverIamge = withTheme(({ theme }) => ({
  minAspectRatio: 1, // Sets the ratio of the image
  maxAspectRatio: 1, // Sets the ratio of the placeholder
  forceRatio: 1,
  maintainAspectRatio: true, // No ratios are respected without this
  overlayColor: theme.colors.paper,
  overlayType: 'featured',
}))(GradientOverlayImage);

// TODO: this object doesn't look to correctly match the data needed for `StyledHorizontalTileFeed` see note on `renderMember`
const loadingStateObject = {
  id: 'fake_id',
  title: '',
  coverImage: [],
};

class GroupSingle extends PureComponent {
  static propTypes = {
    allowMessages: PropTypes.bool,
    avatars: PropTypes.arrayOf(ImageSourceType),
    contentId: PropTypes.string,
    coverImageSources: PropTypes.arrayOf(ImageSourceType),
    groupType: PropTypes.string,
    isLoading: PropTypes.bool,
    members: PropTypes.arrayOf(PropTypes.shape({})),
    parentVideoCall: PropTypes.shape({
      link: PropTypes.string,
      meetingId: PropTypes.string,
      passcode: PropTypes.string,
    }),
    phoneNumbers: PropTypes.arrayOf(PropTypes.string),
    resources: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string,
        url: PropTypes.string,
      })
    ),
    startTime: PropTypes.string,
    summary: PropTypes.string,
    title: PropTypes.string,
    videoCall: PropTypes.shape({
      lableText: PropTypes.shape,
      link: PropTypes.string,
      meetingId: PropTypes.string,
      passcode: PropTypes.string,
    }),
  };

  getNotes() {
    const hasParentVideoCall =
      this.props.parentVideoCall && this.props.parentVideoCall.link;
    const hasVideoCall = this.props.videoCall && this.props.videoCall.link;

    if (!hasParentVideoCall && !hasVideoCall) return null;

    const videoCallNote = hasVideoCall ? this.props.videoCall.link : '';
    const parentVideoCallNote = hasParentVideoCall
      ? this.props.parentVideoCall.link
      : '';
    const notes = `${
      hasParentVideoCall ? `Join Zoom Meeting:\n${parentVideoCallNote}\n\n` : ''
    }Join Zoom ${
      hasParentVideoCall ? 'Breakout' : ''
    }Meeting:\n${videoCallNote}`;

    return notes.trim();
  }

  static navigationOptions = {
    header: NavigationHeader,
    headerTransparent: true,
    headerMode: 'float',
  };

  renderMember = ({ item, isLoading }) => {
    const photo = get(item, 'photo', {});
    const name = get(item, 'nickName', '') || get(item, 'firstName', '');

    return (
      <MemberCard>
        {!isLoading && photo && photo.uri ? ( // TODO: move this "placeholder" loading state/logic into a `MemberImage` component
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

        <BodyText numberOfLines={1}>{name}</BodyText>
      </MemberCard>
    );
  };

  render() {
    return (
      <StretchyView>
        {({ Stretchy, ...scrollViewProps }) => (
          <FlexedScrollView {...scrollViewProps}>
            <Stretchy>
              <CoverIamge
                isLoading={this.props.isLoading}
                source={this.props.coverImageSources}
              />

              <StyledAvatarCloud
                avatars={this.props.avatars}
                isLoading={!this.props.avatars && this.props.isLoading}
              />
              <StyledTitle>
                <StyledH3 isLoading={this.props.isLoading} numberOfLines={2}>
                  {this.props.title}
                </StyledH3>
                <StyledH5 isLoading={this.props.isLoading} numberOfLines={2}>
                  {this.props.groupType}
                </StyledH5>
              </StyledTitle>
            </Stretchy>

            <BackgroundView>
              <PaddedView vertical={false}>
                {this.props.startTime ? (
                  <Cell>
                    <CellItem first>
                      <ScheduleView>
                        <IconView>
                          <StyledIcon
                            isLoading={this.props.isLoading}
                            name="time"
                            size={16}
                          />
                        </IconView>
                        <DateLabel
                          withTime
                          isLoading={
                            !this.props.startTime && this.props.isLoading
                          }
                          date={this.props.startTime}
                        />
                      </ScheduleView>
                    </CellItem>
                    <CellItem>
                      <AddCalEventButton
                        eventNotes={this.getNotes()}
                        eventStart={this.props.startTime}
                        eventTitle={this.props.title}
                        isLoading={this.props.isLoading}
                      />
                    </CellItem>
                  </Cell>
                ) : null}
                <PaddedView horizontal={false}>
                  <BodyText
                    isLoading={!this.props.summary && this.props.isLoading}
                  >
                    {this.props.summary}
                  </BodyText>
                </PaddedView>

                {this.props.videoCall ? (
                  <VideoCall
                    groupId={this.props.contentId}
                    isLoading={this.props.isLoading}
                    parentVideoCall={this.props.parentVideoCall}
                    videoCall={this.props.videoCall}
                    date={this.props.startTime}
                  />
                ) : (
                  <CheckInConnected
                    id={this.props.contentId}
                    isLoading={this.props.isLoading}
                    date={this.props.startTime}
                  />
                )}

                <StyledH4 padded>{'Group Members'}</StyledH4>
              </PaddedView>
              <StyledHorizontalTileFeed
                content={this.props.members}
                isLoading={!this.props.members && this.props.isLoading}
                loadingStateObject={loadingStateObject}
                renderItem={this.renderMember}
              />

              {this.props.phoneNumbers && this.props.allowMessages ? (
                <PaddedView>
                  <MessagesButton recipients={this.props.phoneNumbers} />
                </PaddedView>
              ) : null}

              {!isEmpty(this.props.resources) ? (
                <Resources
                  isLoading={this.props.isLoading}
                  navigation={this.props.navigation}
                  resources={this.props.resources}
                />
              ) : null}
            </BackgroundView>
          </FlexedScrollView>
        )}
      </StretchyView>
    );
  }
}

export default GroupSingle;
