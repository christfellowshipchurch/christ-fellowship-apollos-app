import React from 'react'
import { Animated, View, ImageBackground, StyleSheet, Text, SafeAreaView } from 'react-native'
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
  marginTop: theme.sizing.baseUnit,
  flex: 1,
  flexDirection: 'column'
}))(SafeAreaView)


const DarkOverlay = styled(({ theme }) => ({
  backgroundColor: 'rgba(0, 0, 0, .55)',
  position: 'absolute',
  height: '100%',
  width: '100%'
}))(View)

const Content = ({
  withGoBack,
  children,
  range,
  minHeight,
  maxHeight,
  delay
}) => {
  const padding = { min: '0%', max: '20%' }
  let paddingLeft = withGoBack
    ? padding.max
    : range.interpolate({
      inputRange: [minHeight, minHeight * 1.1, maxHeight],
      outputRange: [padding.min, padding.max, padding.max],
    })

  return (
    <Animated.View style={{
      width: '100%',
      height: '100%',
      paddingLeft,
      paddingRight: padding.max,
      top: 0,
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {children}
    </Animated.View>
  )
}


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
      <View style={{ zIndex: 3, height: '100%', width: '100%' }}>
        {children}
      </View>
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
  animation,
  title,
  withGoBack,
  disableSettings,
  edit
}) => (
    <BackgroundImage {...animation}>
      <PaddedFlexedView>
        <NavigationHeader
          style={{ zIndex: 4 }}
          navigation={navigation}
          animation={animation}
          title={title}
          withGoBack={withGoBack || edit}
          disableSettings={disableSettings || edit} />
        <Content {...animation} withGoBack={withGoBack || edit}>
          <UserAvatarView
            firstName={firstName}
            lastName={lastName}
            location={location}
            disabled={disabled}
            isLoading={isLoading}
            animation={animation}
            edit={edit}
            withGoBack={withGoBack}
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
