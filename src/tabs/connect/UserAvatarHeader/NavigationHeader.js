import React from 'react'
import { Animated } from 'react-native'
import PropTypes from 'prop-types'
import { withNavigation } from 'react-navigation'

import {
  Touchable,
  Icon,
  styled,
  FlexedView,
} from '@apollosproject/ui-kit'


const Header = styled(({ theme }) => ({
  position: 'absolute',
  flexDirection: 'row',
  paddingTop: theme.sizing.baseUnit * 4,
  paddingHorizontal: theme.sizing.baseUnit * 2,
  alignItems: 'center',
  justifyContent: 'center'
}))(FlexedView)

const HeaderAction = styled(({ theme }) => ({
  width: '10%',
  alignSelf: 'flex-start'
}))(Touchable)

const HeaderTitle = ({ range, minHeight, maxHeight, children }) => {
  const opacity = range.interpolate({
    inputRange: [minHeight, maxHeight],
    outputRange: [0, 1],
  })

  return (
    <Animated.Text style={{
      width: '80%',
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
  animation
}) => (
    <Header>
      <HeaderAction onPress={() => navigation.navigate('UserSettings')}>
        <Icon name="arrow-back" fill={'white'} />
      </HeaderAction>

      <HeaderTitle {...animation}>Title</HeaderTitle>

      <HeaderAction onPress={() => navigation.navigate('UserSettings')}>
        <Icon name="settings" fill={'white'} />
      </HeaderAction>
    </Header>
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
