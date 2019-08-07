import React from 'react'
import { Animated, View, ImageBackground, StyleSheet, Text } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import PropTypes from 'prop-types'
import { compose } from 'recompose'
import { withNavigation } from 'react-navigation'

import NavigationHeader from './NavigationHeader'
import UserAvatarView from './UserAvatarView'

import {
  withIsLoading,
  Touchable,
  Icon,
  withTheme,
  styled,
  PaddedView,
  FlexedView,
  H4
} from '@apollosproject/ui-kit'

const CampusImage = styled(({ theme }) => ({
  width: '100%',
  height: '100%',
}))(ImageBackground)

const PaddedFlexedView = styled(({ theme }) => ({
  paddingTop: theme.sizing.baseUnit * 2,
  flexDirection: 'column'
}))(FlexedView)


const DarkOverlay = styled(({ theme }) => ({
  backgroundColor: 'rgba(0, 0, 0, .55)',
  position: 'absolute',
  height: '100%',
  width: '100%'
}))(View)

const Content = styled(({ theme }) => ({
  width: '100%',
  height: '100%',
  paddingHorizontal: '20%',
  // position: 'absolute',
  top: 0,
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  // paddingTop: theme.sizing.baseUnit * 4
}))(View)


const BackgroundImage = ({ range, children }) => (
  <Animated.View style={{
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'lightskyblue',
    height: range,
    zIndex: 2,
  }} >
    <CampusImage source={{ uri: 'https://picsum.photos/375/812/?random' }}>
      <DarkOverlay />
      {children}
    </CampusImage>
  </Animated.View>
)

const UserAvatarHeader = ({
  firstName,
  lastName,
  location,
  navigation,
  disabled,
  isLoading,
  animation
}) => (
    <BackgroundImage {...animation}>
      <PaddedFlexedView style={{ zIndex: 3 }}>
        <NavigationHeader animation={animation} />
        <Content>
          <UserAvatarView
            firstName={firstName}
            lastName={lastName}
            location={location}
            disabled={disabled}
            isLoading={isLoading}
            animation={animation}
          />
        </Content>
      </PaddedFlexedView>

    </BackgroundImage>
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
