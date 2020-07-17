import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

import {
  Avatar,
  AvatarList,
  ImageSourceType,
  withIsLoading,
  withTheme,
  ThemeMixin,
  styled,
  Icon,
  Touchable,
} from '@apollosproject/ui-kit';

import HorizontalFeatureFeed from 'ui/HorizontalFeatureFeed';
import { get } from 'lodash';
import { useCurrentUser } from '../../../hooks';

const getAvatars = (prayers) =>
  prayers.map((prayer) => ({
    id: prayer.id,
    notification: !prayer.isPrayed,
    source: prayer.requestor?.photo,
  }));

const AddIcon = withTheme(({ theme, themeSize }) => ({
  fill: theme.colors.white,
  name: 'plus',
  size: themeSize * 0.5,
}))(Icon);

const AddIconBackground = styled(({ isLoading, theme, themeSize }) => ({
  position: 'absolute',
  bottom: 0,
  right: 0,
  backgroundColor: isLoading
    ? theme.colors.background.inactive
    : theme.colors.secondary,
  borderRadius: themeSize * 0.5,
  width: themeSize,
  height: themeSize,
  borderWidth: 2,
  borderColor: theme.colors.background.screen,
  justifyContent: 'center',
  alignItems: 'center',
}))(View);

const AndroidTouchableRippleFix = styled(({ theme }) => ({
  marginRight: theme.sizing.baseUnit * 0.5,
  overflow: 'hidden',
}))(View);

const AvatarConnected = ({ themeSize }) => {
  const { data } = useCurrentUser();

  return (
    <Avatar
      source={get(data, 'currentUser.profile.photo')}
      themeSize={themeSize}
    />
  );
};

const renderListHeader = (onPressAdd, isLoading, theme) => {
  const themeSize = theme.sizing.avatar.medium * 0.8;
  const iconSize = themeSize / 2.5;

  return onPressAdd ? (
    <AndroidTouchableRippleFix>
      <Touchable onPress={() => onPressAdd()} disabled={isLoading}>
        <AvatarConnected themeSize={themeSize} />
        <AddIconBackground isLoading={isLoading} themeSize={iconSize}>
          <AddIcon isLoading={isLoading} themeSize={iconSize} />
        </AddIconBackground>
      </Touchable>
    </AndroidTouchableRippleFix>
  ) : null;
};

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
        ListHeaderComponent={renderListHeader(onPressAdd, isLoading, theme)}
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
