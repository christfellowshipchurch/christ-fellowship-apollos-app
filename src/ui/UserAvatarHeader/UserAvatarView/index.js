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

const AnimatedAvitar = ({
  range,
  minHeight,
  maxHeight,
  delay,
  isLoading,
  disabled,
  height,
  onLayout,
  edit
}) => {
  const width = range.interpolate({
    inputRange: [minHeight, maxHeight * delay, maxHeight],
    outputRange: ['40%', '100%', '100%'],
  })

  return (
    <Animated.View style={{
      width,
      alignSelf: 'flex-start',
      position: 'absolute',
      left: 0,
      top: '50%',
      transform: [{ translateY: (height / 2) * -1 }],
    }}
      onLayout={onLayout}
    >
      <AvatarForm
        edit={edit}
        isLoading={isLoading}
        text={false}
        disabled={disabled}
        animation={{ range, minHeight, maxHeight, delay }} />
    </Animated.View>
  )
}

const AnimatedProfileInformation = ({
  range,
  minHeight,
  maxHeight,
  delay,
  firstName,
  lastName,
  location,
  height,
  width,
  isLoading,
  marginTop,
  onLayout,
  edit
}) => {
  const [nameWidth, setNameWidth] = useState(0)
  const [locationWidth, setLocationWidth] = useState(0)

  // container animation calculations and styling
  const container = {
    width: { min: '60%', max: '100%' },
    translateY: { min: (height / 2) * -1, max: marginTop }
  }

  const widthPercent = range.interpolate({
    inputRange: [minHeight, maxHeight * delay, maxHeight],
    outputRange: [container.width.min, container.width.max, container.width.max],
  })

  const translateY = range.interpolate({
    inputRange: [minHeight, maxHeight * delay, maxHeight],
    outputRange: [container.translateY.min, container.translateY.max, container.translateY.max],
  })

  // name text animation calculations and styling
  const name = {
    fontSize: { min: 16, max: 24 },
    translateX: { min: 0, max: (width - nameWidth) / 2 }
  }

  const fontSize = range.interpolate({
    inputRange: [minHeight, maxHeight * delay, maxHeight],
    outputRange: [name.fontSize.min, name.fontSize.max, name.fontSize.max],
  })

  const nameTranslateX = range.interpolate({
    inputRange: [minHeight, maxHeight * delay, maxHeight],
    outputRange: [name.translateX.min, name.translateX.max, name.translateX.max],
  })

  // subtitle text animation calculations and styling
  const subtitle = {
    translateX: { min: 0, max: (width - locationWidth) / 2 }
  }

  const subtitleTranslateX = range.interpolate({
    inputRange: [minHeight, maxHeight * delay, maxHeight],
    outputRange: [subtitle.translateX.min, subtitle.translateX.max, subtitle.translateX.max],
  })

  return (
    <Animated.View style={{
      width: widthPercent,
      flex: 1,
      flexDirection: 'column',
      alignItems: 'flex-start',
      position: 'absolute',
      top: '50%',
      right: 0,
      transform: [{ translateY }],
    }}
      onLayout={onLayout}>

      <Animated.Text style={{
        fontSize,
        fontWeight: 'bold',
        color: 'white',
        transform: [{ translateX: nameTranslateX }],
      }}
        onLayout={(e) => setNameWidth(e.nativeEvent.layout.width)} >
        {`${firstName} ${lastName}`}
      </Animated.Text>

      {(location && !edit) && (
        <Animated.View style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          transform: [{ translateX: subtitleTranslateX }],
        }}
          onLayout={(e) => setLocationWidth(e.nativeEvent.layout.width)} >
          <Icon name={'pin'} fill={'white'} size={12} isLoading={isLoading} />
          <StyledSubHeader>{location}</StyledSubHeader>
        </Animated.View>
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
      position: 'relative',
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
