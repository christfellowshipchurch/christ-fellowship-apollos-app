import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { get } from 'lodash';

import {
  Card,
  CardContent,
  CardImage,
  H5,
  ImageSourceType,
  styled,
  withIsLoading,
  withTheme,
  Icon,
} from '@apollosproject/ui-kit';

import AvatarCloud from '../../AvatarCloud';
import { HorizontalPrayerRequestCard } from '..';
import DateLabel from '../../DateLabel';

const CardWrapper = styled(({ customTheme, theme }) => ({
  width: HorizontalPrayerRequestCard.cardWidth,
  flex: 1,
}))(Card);

const Image = withTheme(({ customTheme, theme }) => ({
  minAspectRatio: 1.5,
  maxAspectRatio: 1.5,
  maintainAspectRatio: true,
  forceRatio: 1.5, // fixes loading state
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
}))(CardContent);

const Title = styled(({ theme }) => ({
  color: theme.colors.text.primary,
  textAlign: 'center',
}))(H5);

const StyledAvatarCloud = styled({
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
  top: 0,
})(AvatarCloud);

const IconView = styled({
  paddingRight: 6,
})(View);

const ScheduleView = styled(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  paddingTop: theme.sizing.baseUnit,
}))(View);

const HorizontalGroupCard = withIsLoading(
  ({ fill, coverImage, isLoading, title, avatars, dateTime }) => {
    const date = get(dateTime, 'start', '');
    return (
      <CardWrapper isLoading={isLoading} inHorizontalList>
        <View>
          <Image source={coverImage} isLoading={isLoading} />
          {!isLoading && (
            <StyledAvatarCloud avatars={avatars} isLoading={isLoading} />
          )}
        </View>
        <Content>
          {title ? (
            <Title isLoading={isLoading} numberOfLines={2}>
              {title}
            </Title>
          ) : null}
          {date ? (
            <ScheduleView>
              <IconView>
                <Icon isLoading={isLoading} name="time" size={16} fill={fill} />
              </IconView>
              <DateLabel isLoading={isLoading} date={date} />
            </ScheduleView>
          ) : null}
        </Content>
      </CardWrapper>
    );
  }
);

HorizontalGroupCard.propTypes = {
  coverImage: PropTypes.oneOfType([
    PropTypes.arrayOf(ImageSourceType),
    ImageSourceType,
  ]).isRequired,
  summary: PropTypes.string,
  title: PropTypes.string,
};

HorizontalGroupCard.displayName = 'HorizontalGroupCard';

export default withTheme(({ theme, ...props }) => ({
  fill: theme.colors.darkTertiary,
  ...props,
}))(HorizontalGroupCard);
