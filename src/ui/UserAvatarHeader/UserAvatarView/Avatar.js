import React from 'react'
import { Animated } from 'react-native'
import PropTypes from 'prop-types'
import { View } from 'react-native'
import { get } from 'lodash'
import { compose } from 'recompose'

import {
  ConnectedImage,
  ActivityIndicator,
  Icon,
  styled,
  withTheme,
} from '@apollosproject/ui-kit'

const AVATAR_SMALL = 80
const AVATAR_LARGE = 160

const AnimatedContainer = ({
  children,
  range,
  maxHeight,
  minHeight,
  avatarSmall = AVATAR_SMALL,
  avatarLarge = AVATAR_LARGE,
  edit
}) => {
  const size = range.interpolate({
    inputRange: [minHeight, maxHeight],
    outputRange: [avatarSmall, avatarLarge],
  })

  const borderRadius = range.interpolate({
    inputRange: [minHeight, maxHeight],
    outputRange: [avatarSmall / 2, avatarLarge / 2],
  })

  return (
    <Animated.View style={{
      width: size,
      height: size,
      backgroundColor: 'white',
      borderRadius,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    }}>
      {children}

      {edit &&
        <View style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          width: '100%',
          backgroundColor: 'rgba(0, 0, 0, .5)',
          opacity: 0.75
        }}>
          <Icon name="camera" size={24} fill='white' />
        </View>}
    </Animated.View>
  )
}

const LoadingIcon = compose(
  withTheme(({ theme: { colors } = {} }) => ({ color: colors.white })),
  styled({
    zIndex: 1,
  })
)(ActivityIndicator)

const PlaceholderIcon = compose(
  withTheme(({ theme: { colors } = {} }) => ({
    fill: colors.background.inactive,
  }))
)(Icon)

const Image = styled(({ themeSize }) => ({
  width: '100%',
  height: '100%',
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
}))(ConnectedImage)

const Avatar = ({
  containerStyle,
  source,
  isLoading,
  animation,
  edit,
  ...imageProps
}) => (
    <AnimatedContainer {...animation} edit={edit}>
      {isLoading ? <LoadingIcon /> : null}
      {source && source.uri ? (
        <Image
          source={source}
          {...imageProps}
          isLoading={isLoading}
        />
      ) : (
          <PlaceholderIcon name="profile" size={AVATAR_SMALL / 2} />
        )}
    </AnimatedContainer>
  )

Avatar.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  containerStyle: PropTypes.any, // eslint-disable-line
  animation: PropTypes.any,
  ...ConnectedImage.propTypes,
};

export default withTheme(({ theme, size }) => ({
  themeSize: get(theme.sizing.avatar, size, theme.sizing.avatar.small),
}))(Avatar)