import React from 'react';
import { Animated, View } from 'react-native';
import PropTypes from 'prop-types';
import { get } from 'lodash';
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
} from '@apollosproject/ui-kit';

import AvatarCloud from '../ui/AvatarCloud';

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
  color: theme.colors.black,
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

const GroupSingle = ({ navigation, fill }) => {
  const coverImageSources = [
    {
      uri: 'https://picsum.photos/800',
    },
  ];

  const loadingStateObject = {
    id: 'fake_id',
    title: '',
    coverImage: [],
  };

  const content = navigation.getParam('content', []);
  const avatars = navigation.getParam('avatars', []);
  const schedule = get(content, 'schedule', '');

  const renderMember = ({ item }) => {
    console.log(item);
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

  return (
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
                />
                <StyledAvatarCloud
                  avatars={avatars}
                  primaryAvatar={'https://picsum.photos/200'}
                />
              </Stretchy>
            ) : null}
            <PaddedView>
              <H3>{content.title}</H3>
              {schedule ? (
                <ScheduleView>
                  <IconView>
                    <Icon name="time" size={16} fill={fill} />
                  </IconView>
                  <Schedule numberOfLines={1}>{schedule}</Schedule>
                </ScheduleView>
              ) : null}
              <PaddedView horizontal={false}>
                <BodyText>{content.summary}</BodyText>
              </PaddedView>

              <H5>{'Group Members'}</H5>
            </PaddedView>
            <StyledHorizontalTileFeed
              content={content.members}
              renderItem={renderMember}
              loadingStateObject={loadingStateObject}
              // isLoading={loading}
            />
          </FlexedScrollView>
        )}
      </StretchyView>
    </BackgroundView>
  );
};

GroupSingle.propTypes = {};

export default withTheme(({ theme, ...props }) => ({
  fill: theme.colors.darkTertiary,
  ...props,
}))(GroupSingle);
