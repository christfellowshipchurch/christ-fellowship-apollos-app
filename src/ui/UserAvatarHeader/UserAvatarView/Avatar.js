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
  withTheme
} from '@apollosproject/ui-kit'

const AnimatedContainer = ({ children, range, maxHeight, minHeight, avatarSmall = 80, avatarLarge = 160 }) => {
  const size = range.interpolate({
    inputRange: [minHeight, maxHeight],
    outputRange: [avatarSmall, avatarLarge],
    // extrapolate: 'clamp'
  })

  const borderRadius = range.interpolate({
    inputRange: [minHeight, maxHeight],
    outputRange: [avatarSmall / 2, avatarLarge / 2],
    // extrapolate: 'clamp'
  })

  return (
    <Animated.View style={{
      width: size,
      height: size,
      backgroundColor: 'white',
      borderRadius,
      alignItems: 'center',
      justifyContent: 'flex-end',
      overflow: 'hidden',
    }}>
      {children}
    </Animated.View>
  )
}

const AnimatedPlaceholder = ({ range, maxHeight, minHeight, avatarSmall = 80, avatarLarge = 160 }) => {
  const size = range.interpolate({
    inputRange: [minHeight, maxHeight],
    outputRange: [avatarSmall, avatarLarge],
  })

  return (<PlaceholderIcon name="avatar" size={size} />)
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
  // borderRadius: themeSize / 2,
}))(ConnectedImage)

const Avatar = ({
  containerStyle,
  source,
  isLoading,
  animation,
  ...imageProps }) => {
  console.log({ animation })
  return (
    <AnimatedContainer {...animation}>
      {isLoading ? <LoadingIcon /> : null}
      {source && source.uri ? (
        <Image
          source={source}
          {...imageProps}
          isLoading={isLoading}
        />
      ) : (
          <PlaceholderIcon name="avatar" size={80} />
        )}
    </AnimatedContainer>
  )
}

Avatar.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  containerStyle: PropTypes.any, // eslint-disable-line
  animation: PropTypes.any,
  ...ConnectedImage.propTypes,
};

export default withTheme(({ theme, size }) => ({
  themeSize: get(theme.sizing.avatar, size, theme.sizing.avatar.small),
}))(Avatar)