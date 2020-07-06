import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { get } from 'lodash';

import {
  BodySmall,
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

const SquareCard = styled(({ customTheme, theme }) => ({
  width: 212,
  flex: 1,
  backgroundColor: get(customTheme, 'colors.primary', theme.colors.darkPrimary),
}))(Card);

const Image = withTheme(({ customTheme, theme }) => ({
  minAspectRatio: 1.5,
  maxAspectRatio: 1.5,
  maintainAspectRatio: true,
  forceRatio: 1.5, // fixes loading state
  overlayColor: get(customTheme, 'colors.primary', theme.colors.darkPrimary), // else check for a custom theme (prop) or default to black.
  overlayType: 'featured',
  style: { flex: 1 },
}))(CardImage);

const Content = styled(({ theme }) => ({
  alignItems: 'center',
  textAlign: 'center',
  paddingHorizontal: theme.sizing.baseUnit,
  paddingBottom: theme.sizing.baseUnit,
}))(CardContent);

const Schedule = styled(({ theme }) => ({
  color: theme.colors.white,
}))(BodySmall);

const Title = styled(({ theme }) => ({
  color: theme.colors.white,
  textAlign: 'center',
}))(H5);

const StyledAvatarCloud = styled({
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
  top: 0,
})(AvatarCloud);

const avatars = [
  'https://picsum.photos/200?1',
  'https://picsum.photos/200?2',
  'https://picsum.photos/200?3',
];

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
  ({ fill, coverImage, isLoading, summary, title, schedule }) => (
    <SquareCard isLoading={isLoading} inHorizontalList>
      <View>
        <Image source={coverImage} hasTitleAndSummary={!!summary && !!title} />
        <StyledAvatarCloud
          avatars={avatars}
          primaryAvatar={'https://picsum.photos/200'}
        />
      </View>
      <Content>
        {title ? <Title numberOfLines={2}>{title}</Title> : null}
        {schedule ? (
          <ScheduleView>
            <IconView>
              <Icon name="time" size={16} fill={fill} />
            </IconView>
            <Schedule numberOfLines={1}>{schedule}</Schedule>
          </ScheduleView>
        ) : null}
      </Content>
    </SquareCard>
  )
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
