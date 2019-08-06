import React from 'react'
import { Animated, View, ImageBackground, StyleSheet } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import PropTypes from 'prop-types'
import { compose } from 'recompose'
import { withNavigation } from 'react-navigation'

import UserAvatarView from 'ChristFellowship/src/ui/UserAvatarView'

import {
  withIsLoading,
  Touchable,
  Icon,
  withTheme,
  styled,
  PaddedView,
  FlexedView,
  GradientOverlayImage
} from '@apollosproject/ui-kit'

const CampusImage = styled(({ theme }) => ({
  width: '100%',
  height: 375
}))(ImageBackground)

const PaddedFlexedView = styled(({ theme }) => ({
  paddingVertical: theme.sizing.baseUnit * 2,
}))(FlexedView)

const SettingsContainer = styled(({ theme }) => ({
  alignItems: 'flex-end',
  paddingVertical: theme.sizing.baseUnit,
  paddingHorizontal: theme.sizing.baseUnit * 1.5,
}))(Touchable)

const SettingsIcon = compose(
  withTheme(({ theme }) => ({
    name: 'settings',
    fill: theme.colors.white,
  }))
)(Icon)

const DarkOverlay = styled(({ theme }) => ({
  backgroundColor: 'rgba(0, 0, 0, .55)',
  position: 'absolute',
  height: '100%',
  width: '100%'
}))(View)

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    // flex: 0,
    // zIndex: 2,
    height: 375,
    width: '100%',
    backgroundColor: 'transparent',

    justifyContent: 'center',
    alignItems: 'center'
  },
  headerBackground: {
    position: 'absolute',
    flex: 0,
    height: 375,
    width: '100%',
    backgroundColor: 'blue',
    // zIndex: 2,
  }
})

const HeaderBackground = ({ animationRange, scrollRangeForAnimation }) => {
  const animateHeader = {
    transform: [
      {
        translateY: animationRange.interpolate({
          inputRange: [0, 1],
          outputRange: [0, scrollRangeForAnimation * -1],
        }),
      },
    ],
  }
  return (
    <Animated.View style={[styles.headerBackground, animateHeader]} pointerEvents="none">
      <CampusImage source={{ uri: 'https://picsum.photos/375/812/?random' }}>
        <DarkOverlay />
      </CampusImage>
    </Animated.View>
  )
}

const UserAvatarHeader = ({
  firstName,
  lastName,
  location,
  navigation,
  disabled,
  isLoading,
  animationRange,
  scrollRangeForAnimation
}) => (
    <View style={styles.container}>
      <HeaderBackground animationRange={animationRange} scrollRangeForAnimation={scrollRangeForAnimation} />
      <PaddedFlexedView>
        <SettingsContainer onPress={() => navigation.navigate('UserSettings')}>
          <SettingsIcon />
        </SettingsContainer>
        <UserAvatarView
          firstName={firstName}
          lastName={lastName}
          location={location}
          disabled={disabled}
          isLoading={isLoading}
        />
      </PaddedFlexedView>
    </View >
  )

UserAvatarHeader.propTypes = {
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  location: PropTypes.string,
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
    navigate: PropTypes.func,
  }),
  disabled: PropTypes.bool,
  isLoading: PropTypes.bool,
}

export default withNavigation(withIsLoading(UserAvatarHeader))
