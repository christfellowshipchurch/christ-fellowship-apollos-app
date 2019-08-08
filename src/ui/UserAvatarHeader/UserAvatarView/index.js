import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Animated, View, ImageBackground, Text } from 'react-native'

import {
  H3,
  H5,
  PaddedView,
  FlexedView,
  ConnectedImage,
  styled,
  ChannelLabel,
  withIsLoading,
  Icon
} from '@apollosproject/ui-kit'

import AvatarForm from './AvatarForm'

const Container = styled(({ theme }) => ({
  flex: 1,
  flexDirection: 'row',
  flexWrap: 'wrap',
  alignItems: 'center',
  alignContent: 'center',
  justifyContent: 'center',
  color: theme.colors.white,
  width: '100%'
}))(FlexedView)

const StyledSubHeader = styled(({ theme }) => ({
  color: theme.colors.white,
  textAlign: 'center',
  paddingLeft: theme.sizing.baseUnit * 0.25
}))(H5)

const Location = styled(({ theme }) => ({
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center'
}))(View)

const AnimatedAvitar = ({
  range,
  minHeight,
  maxHeight,
  isLoading,
  disabled,
  height,
  onLayout,
  edit
}) => {
  const width = range.interpolate({
    inputRange: [minHeight, maxHeight],
    outputRange: ['40%', '100%'],
  })

  return (
    <Animated.View style={{
      width,
      position: 'absolute',
      left: 0,
      top: '50%',
      transform: [{ translateY: (height / 2) * -1 }]
    }}
      onLayout={onLayout}
    >
      <AvatarForm
        edit={edit}
        isLoading={isLoading}
        text={false}
        disabled={disabled}
        animation={{ range, minHeight, maxHeight }} />
    </Animated.View>
  )
}

const AnimatedProfileInformation = ({
  range,
  minHeight,
  maxHeight,
  firstName,
  lastName,
  location,
  height,
  isLoading,
  marginTop,
  onLayout,
  edit
}) => {
  const widthPercent = range.interpolate({
    inputRange: [minHeight, maxHeight],
    outputRange: ['60%', '100%'],
  })

  const fontSize = range.interpolate({
    inputRange: [minHeight, maxHeight],
    outputRange: [16, 24],
  })

  const translateY = range.interpolate({
    inputRange: [minHeight, maxHeight],
    outputRange: [(height / 2) * -1, marginTop],
  })

  return (
    <Animated.View style={{
      flex: 1,
      alignItems: 'center',
      width: widthPercent,
      textAlign: 'center',
      position: 'absolute',
      right: 0,
      top: '50%',
      transform: [{ translateY }],
    }}
      onLayout={onLayout}>
      <Animated.Text style={{
        textAlign: 'center',
        fontSize,
        fontWeight: 'bold',
        color: 'white',
      }}>
        {`${firstName} ${lastName}`}
      </Animated.Text>

      {(location && !edit) && (
        <Location>
          <Icon name={'pin'} fill={'white'} size={12} isLoading={isLoading} />
          <StyledSubHeader>{location}</StyledSubHeader>
        </Location>
      )}
    </Animated.View>
  )
}

const Content = ({
  animation,
  isLoading,
  disabled,
  firstName,
  lastName,
  location,
  edit
}) => {
  const [avatarLayout, setAvatarLayout] = useState({ height: 0, width: 0 })
  const [infoLayout, setInfoLayout] = useState({ height: 0, width: 0 })

  return (
    <View style={{
      width: '100%',
      height: '100%',
      position: 'relative'
    }}>
      <AnimatedAvitar
        {...animation}
        isLoading={isLoading}
        disabled={disabled}
        onLayout={(e) => {
          const { height } = e.nativeEvent.layout
          setAvatarLayout({ height })
        }}
        {...avatarLayout}
        edit={edit}
      />

      <AnimatedProfileInformation
        {...animation}
        firstName={firstName}
        lastName={lastName}
        location={location}
        onLayout={(e) => {
          const { height, width } = e.nativeEvent.layout
          setInfoLayout({ height, width })
        }}
        {...infoLayout}
        marginTop={avatarLayout.height / 2}
        isLoading={isLoading}
        edit={edit}
      />
    </View>
  )
}

const UserAvatarView = withIsLoading(
  (props) => (
    // todo: handle file select stuff
    <Container>
      <Content {...props} />
    </Container>
  )
)

UserAvatarView.propTypes = {
  photo: ConnectedImage.propTypes.source,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  location: PropTypes.string,
  isLoading: PropTypes.bool,
  disabled: PropTypes.bool,
  blurIntensity: PropTypes.number,
  ...View.propTypes,
}

export default UserAvatarView;
