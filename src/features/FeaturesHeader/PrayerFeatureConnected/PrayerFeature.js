import React from 'react';
import PropTypes from 'prop-types';

import {
  AvatarList,
  ImageSourceType,
  withIsLoading,
  withTheme,
  ThemeMixin,
} from '@apollosproject/ui-kit';

import HorizontalFeatureFeed from 'ui/HorizontalFeatureFeed';

const getAvatars = (prayers) =>
  prayers.map((prayer) => ({
    id: prayer.id,
    notification: !prayer.isPrayed,
    source: prayer.requestor?.photo,
  }));

const PrayerFeature = ({
  prayers = [],
  isLoading,
  onPressAdd,
  onPressAvatar,
  theme,
}) => {
  const themeMixin = {
    colors: {
      primary: theme.colors.text.tertiary,
      secondary: theme.colors.primary,
      white: theme.colors.background.screen,
    },
  };
  return (
    <ThemeMixin mixin={themeMixin}>
      <AvatarList
        avatars={getAvatars(prayers)}
        isCard={false}
        isLoading={isLoading}
        onPressAdd={onPressAdd}
        onPressAvatar={onPressAvatar}
      />
    </ThemeMixin>
  );
};

PrayerFeature.propTypes = {
  prayers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      isPrayed: PropTypes.bool,
      requestor: PropTypes.shape({
        photo: ImageSourceType,
      }),
    })
  ).isRequired,
  isLoading: PropTypes.bool,
  onPressAdd: PropTypes.func,
  onPressAvatar: PropTypes.func,
  theme: PropTypes.shape({
    colors: PropTypes.shape({
      primary: PropTypes.string,
    }),
  }),
};

const PrayerFeatureWrapper = ({ prayers, ...props }) => {
  const style = prayers.length === 0 ? { alignItems: 'center' } : {};
  return (
    <HorizontalFeatureFeed
      Component={PrayerFeature}
      style={style}
      prayers={prayers}
      {...props}
    />
  );
};

PrayerFeatureWrapper.propTypes = PrayerFeature.propTypes;
PrayerFeatureWrapper.defaultProps = {
  prayers: [],
};

export default withTheme()(withIsLoading(PrayerFeatureWrapper));
