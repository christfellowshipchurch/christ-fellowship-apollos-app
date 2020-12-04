import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { get } from 'lodash';

import {
  Card,
  CardContent,
  CardImage,
  H3,
  H5,
  ImageSourceType,
  styled,
  withTheme,
  Icon,
  Avatar,
  UIText,
  ThemeMixin,
} from '@apollosproject/ui-kit';

import DateLabel from '../../DateLabel';
import LiveLabel from '../../LiveLabel';

const CardWrapper = styled(({ inHorizontalList }) => ({
  ...(inHorizontalList ? { width: 240 } : {}),
  flex: 1,
}))(Card);

const Spacer = styled(({ theme }) => ({
  paddingVertical: theme.sizing.baseUnit * 0.5,
}))(View);

const Image = withTheme(({ customTheme, theme }) => ({
  minAspectRatio: 1.66,
  maxAspectRatio: 1.66,
  maintainAspectRatio: true,
  forceRatio: 1.66, // fixes loading state
  overlayColor: get(
    customTheme,
    'colors.primary',
    theme.colors.background.paper
  ), // else check for a custom theme (prop) or default to black.
  overlayType: 'featured',
  style: { flex: 1 },
}))(CardImage);

const Content = styled(({ theme }) => ({
  alignItems: 'center',
  textAlign: 'center',
  paddingHorizontal: theme.sizing.baseUnit,
  paddingBottom: theme.sizing.baseUnit,
  paddingTop: 0,
  marginTop: -1 * theme.sizing.baseUnit,
}))(CardContent);

const VerticalCardTitle = styled(({ theme }) => ({
  color: theme.colors.text.primary,
  textAlign: 'center',
  fontWeight: 'bold',
}))(H3);

const HorizontalCardTitle = styled(({ theme }) => ({
  color: theme.colors.text.primary,
  textAlign: 'center',
  fontWeight: 'bold',
}))(H5);

const IconView = styled({
  paddingRight: 6,
})(View);

const ScheduleView = styled(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  paddingTop: theme.sizing.baseUnit,
}))(View);

const HeadingSpacing = styled(({ theme }) => ({
  alignItems: 'center',
  justifyContent: 'center',
}))(View);

const HeroAvatarSpacing = styled(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,
  position: 'absolute',
  paddingBottom: theme.sizing.baseUnit * 0.5,
}))(View);

const HeroAvatarPosition = withTheme(({ theme, index, zIndex }) => ({
  marginLeft: index > 0 ? theme.sizing.avatar.small * 0.75 * -1 : 0,
  zIndex,
}))(View);

const AvatarSpacing = styled(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
}))(View);

const AvatarPosition = styled(({ theme, index, zIndex }) => ({
  marginLeft: index > 0 ? theme.sizing.avatar.small * 0.45 * -1 : 0,
  zIndex,
}))(View);

const ExtraAvatarsText = styled(({ theme }) => ({
  fontSize: 12,
  color: theme.colors.text.secondary,
  paddingLeft: 5,
}))(UIText);

const GroupCard = ({
  fill,
  coverImage,
  isLoading,
  title,
  heroAvatars,
  totalHeroAvatars,
  avatars,
  totalAvatars,
  dateTime,
  theme,
  isLive,
  inHorizontalList,
}) => {
  const date = get(dateTime, 'start', '');
  const heroAvatarsDiff = totalHeroAvatars - heroAvatars.length;
  const avatarsDiff = totalAvatars - avatars.length;

  // order is Vertical, Horizontal value
  const valueFromListStyle = (v, h) => (inHorizontalList ? h : v);

  // MARK : - Feed specific styles
  const Title = valueFromListStyle(VerticalCardTitle, HorizontalCardTitle);
  const heroAvatarSize = valueFromListStyle(75, 50);
  const avatarSize = heroAvatarSize * 0.45;

  return (
    <ThemeMixin mixin={theme}>
      <CardWrapper isLoading={isLoading} inHorizontalList={inHorizontalList}>
        <HeadingSpacing>
          <Image source={coverImage} />
          {heroAvatars.length > 0 && (
            <HeroAvatarSpacing>
              {heroAvatars.map((hero, i) => (
                <HeroAvatarPosition
                  key={`${hero}`}
                  index={i}
                  zIndex={avatars.length + 1 - i}
                >
                  <Avatar source={hero} themeSize={heroAvatarSize} />
                </HeroAvatarPosition>
              ))}

              {heroAvatarsDiff > 0 && (
                <ExtraAvatarsText>{`+${heroAvatarsDiff}`}</ExtraAvatarsText>
              )}
            </HeroAvatarSpacing>
          )}
        </HeadingSpacing>

        <Content>
          {!!title && (
            <Spacer>
              <Title numberOfLines={2}>{title}</Title>
            </Spacer>
          )}

          {avatars.length > 0 && (
            <Spacer>
              <AvatarSpacing>
                {avatars.map((avatar, i) => (
                  <AvatarPosition
                    key={`${avatar}`}
                    index={i}
                    zIndex={avatars.length + 1 - i}
                  >
                    <Avatar source={avatar} themeSize={avatarSize} />
                  </AvatarPosition>
                ))}

                {avatarsDiff > 0 && (
                  <ExtraAvatarsText>{`+${avatarsDiff}`}</ExtraAvatarsText>
                )}
              </AvatarSpacing>
            </Spacer>
          )}

          {!!date &&
            !isLive && (
              <Spacer>
                <ScheduleView>
                  <IconView>
                    <Icon name="time" size={16} fill={fill} />
                  </IconView>
                  <DateLabel isLoading={isLoading} date={date} />
                </ScheduleView>
              </Spacer>
            )}

          {isLive && (
            <Spacer>
              <LiveLabel />
            </Spacer>
          )}
        </Content>
      </CardWrapper>
    </ThemeMixin>
  );
};

GroupCard.propTypes = {
  coverImage: PropTypes.oneOfType([
    PropTypes.arrayOf(ImageSourceType),
    ImageSourceType,
  ]).isRequired,
  isLoading: PropTypes.bool,
  title: PropTypes.string,
  avatars: PropTypes.arrayOf(ImageSourceType),
  totalAvatars: PropTypes.number,
  heroAvatars: PropTypes.arrayOf(ImageSourceType),
  totalHeroAvatars: PropTypes.number,
  theme: PropTypes.shape({}),
  isLive: PropTypes.bool,
  inHorizontalList: PropTypes.bool,
};

GroupCard.defaultProps = {
  avatars: [],
  totalAvatars: 0,
  heroAvatars: [],
  totalHeroAvatars: 0,
  isLive: false,
  inHorizontalList: false,
};

GroupCard.displayName = 'GroupCard';

export default withTheme(({ theme, ...props }) => ({
  fill: theme.colors.darkTertiary,
  ...props,
}))(GroupCard);
