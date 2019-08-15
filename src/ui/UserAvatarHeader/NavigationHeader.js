import React from 'react'
import { Animated, View } from 'react-native'
import PropTypes from 'prop-types'
import { withNavigation } from 'react-navigation'

import {
  Touchable,
  Icon,
  styled,
  FlexedView,
} from '@apollosproject/ui-kit'

const Container = styled(({ theme, height }) => ({
  position: 'absolute',
  height,
  width: '100%',
  top: 0,
  left: 0,
  // backgroundColor: 'purple',
  marginTop: theme.sizing.baseUnit * -0.75
}))(View)

const Header = styled(({ theme }) => ({
  flexDirection: 'row',
  // paddingTop: theme.sizing.baseUnit * 4,
  paddingHorizontal: theme.sizing.baseUnit * 2,
  alignItems: 'center',
  justifyContent: 'center'
}))(FlexedView)

const HeaderTitle = ({ range, minHeight, maxHeight, children }) => {
  const opacity = range.interpolate({
    inputRange: [maxHeight - 20, maxHeight],
    outputRange: [0, 1],
  })

  return (
    <Animated.Text style={{
      textAlign: 'center',
      color: 'white',
      opacity
    }}>
      {children}
    </Animated.Text>
  )
}

const NavigationHeader = ({
  navigation,
  animation,
  style,
  withGoBack = false,
  title,
  disableSettings = false
}) => (
    <Container height={animation.minHeight} style={style}>
      <Header>
        <View style={{ flex: 1 }}>
          {withGoBack &&
            <Touchable onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" fill={'white'} />
            </Touchable>
          }
        </View>

        <View style={{ flex: 3 }}>
          <HeaderTitle {...animation}>{title}</HeaderTitle>
        </View>

        <View style={{ flex: 1, alignItems: 'flex-end' }}>
          {!disableSettings &&
            <Touchable onPress={() => navigation.navigate('UserSettings')}>
              <Icon name="settings" fill={'white'} />
            </Touchable>
          }
        </View>

      </Header>
    </Container>
  )

NavigationHeader.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
    navigate: PropTypes.func,
  }),
  animation: PropTypes.shape({
    minHeight: PropTypes.number,
    navigate: PropTypes.number,
  }),
}

export default withNavigation(NavigationHeader)
