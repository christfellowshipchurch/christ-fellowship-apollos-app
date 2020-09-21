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

const StyledAvatarCloud = styled(({ theme }) => ({
  position: 'absolute',
  left: theme.sizing.baseUnit,
  right: theme.sizing.baseUnit,
  bottom: 0,
  top: theme.sizing.baseUnit,
}))(AvatarCloud);

const IconView = styled({
  paddingRight: 6,
})(View);

const ScheduleView = styled(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  paddingTop: theme.sizing.baseUnit,
}))(View);

const HorizontalGroupCard = ({
  fill,
  coverImage,
  isLoading,
  title,
  avatars,
  dateTime,
}) => {
  const date = get(dateTime, 'start', '');
  return (
    <CardWrapper isLoading={isLoading} inHorizontalList>
      <View>
        <Image source={coverImage} />
        {!isLoading && (
          <StyledAvatarCloud avatars={avatars} isLoading={isLoading} />
        )}
      </View>
      <Content>
        {title ? <Title numberOfLines={2}>{title}</Title> : null}
        {date ? (
          <ScheduleView>
            <IconView>
              <Icon name="time" size={16} fill={fill} />
            </IconView>
            <DateLabel isLoading={isLoading} date={date} />
          </ScheduleView>
        ) : null}
      </Content>
    </CardWrapper>
  );
};

HorizontalGroupCard.propTypes = {
  coverImage: PropTypes.oneOfType([
    PropTypes.arrayOf(ImageSourceType),
    ImageSourceType,
  ]).isRequired,
  isLoading: PropTypes.bool,
  title: PropTypes.string,
};

HorizontalGroupCard.displayName = 'HorizontalGroupCard';

export default withTheme(({ theme, ...props }) => ({
  fill: theme.colors.darkTertiary,
  ...props,
}))(HorizontalGroupCard);
