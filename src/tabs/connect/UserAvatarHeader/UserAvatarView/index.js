import React from 'react'
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
} from '@apollosproject/ui-kit';

import AvatarForm from './AvatarForm';

const Container = styled(({ theme }) => ({
  position: 'absolute',
  flexDirection: 'column',
}))(View);

const Content = styled(({ theme }) => ({
  flex: 1,
  flexDirection: 'row',
  flexWrap: 'wrap',
  alignItems: 'center',
  alignContent: 'center',
  justifyContent: 'center',
  color: theme.colors.white,
  // backgroundColor: 'red'
}))(FlexedView)

const StyledHeader = styled(({ theme }) => ({
  color: theme.colors.white,
  textAlign: 'center'
}))(H3)

const StyledSubHeader = styled(({ theme }) => ({
  color: theme.colors.white,
  textAlign: 'center'
  // paddingLeft: theme.sizing.baseUnit * 0.25
}))(H5)

const Location = styled(({ theme }) => ({
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center'
}))(View)

const AnimatedAvitar = ({ range, minHeight, maxHeight, isLoading, disabled }) => {
  const width = range.interpolate({
    inputRange: [minHeight, maxHeight],
    outputRange: ['40%', '100%'],
  })

  return (
    <Animated.View style={{
      width,
      // backgroundColor: 'blue',
      // alignSelf: 'flex-start'
    }}>
      <AvatarForm isLoading={isLoading} text={false} disabled={disabled} animation={{ range, minHeight, maxHeight }} />
    </Animated.View>
  )
}

const AnimatedProfileInformation = ({ range, minHeight, maxHeight, firstName, lastName, location }) => {
  const width = range.interpolate({
    inputRange: [minHeight, maxHeight],
    outputRange: ['60%', '100%'],
  })
  const fontSize = range.interpolate({
    inputRange: [minHeight, maxHeight],
    outputRange: [16, 24],
  })

  return (
    <Animated.View style={{
      width,
      textAlign: 'center',
      // backgroundColor: 'green',
      // alignSelf: 'flex-end',
    }}>
      <Animated.Text style={{
        fontSize,
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'white'
      }}>
        Brandi Myszkowski
      </Animated.Text>
      {location && (
        <StyledSubHeader>{location}</StyledSubHeader>
      )}
    </Animated.View>
  )
}

const UserAvatarView = withIsLoading(
  ({
    theme,
    firstName,
    lastName,
    location,
    isLoading,
    disabled,
    animation,
    ...viewProps
  }) => (
      // todo: handle file select stuff
      <Content>
        <AnimatedAvitar {...animation} isLoading={isLoading} disabled={disabled} />

        <AnimatedProfileInformation {...animation} firstName={firstName} lastName={lastName} location={location} />

        {/* <View>
          <StyledHeader>
            {firstName} {lastName}
          </StyledHeader>
          {location && (
            <Location>
              <Icon name={'pin'} fill={'white'} size={'12'} isLoading={isLoading} />
              <StyledSubHeader>{location}</StyledSubHeader>
            </Location>
          )}
        </View> */}
      </Content>
    )
);

UserAvatarView.propTypes = {
  photo: ConnectedImage.propTypes.source,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  location: PropTypes.string,
  isLoading: PropTypes.bool,
  disabled: PropTypes.bool,
  blurIntensity: PropTypes.number,
  ...View.propTypes,
};

export default UserAvatarView;
