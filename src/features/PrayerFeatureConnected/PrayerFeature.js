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
  isCard,
  isLoading,
  onPressAdd,
  onPressAvatar,
  theme,
}) => {
  const themeMixin = {
    colors: {
      primary: theme.colors.text.tertiary,
      secondary: theme.colors.primary,
    },
  };
  return (
    <ThemeMixin mixin={themeMixin}>
      <AvatarList
        avatars={getAvatars(prayers)}
        isCard={isCard}
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
  isCard: PropTypes.bool,
  isLoading: PropTypes.bool,
  onPressAdd: PropTypes.func,
  onPressAvatar: PropTypes.func,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  theme: PropTypes.shape({
    colors: PropTypes.shape({
      primary: PropTypes.string,
    }),
  }),
};

PrayerFeature.defaultProps = {
  isCard: false,
};

const PrayerFeatureWrapper = (props) => (
  <HorizontalFeatureFeed Component={PrayerFeature} {...props} />
);

export default withTheme()(withIsLoading(PrayerFeatureWrapper));
