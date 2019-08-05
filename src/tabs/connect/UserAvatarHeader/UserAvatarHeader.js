import React from 'react'
import { View, ImageBackground } from 'react-native'
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

const Container = styled(({ theme }) => ({
  alignItems: 'center',
  flexDirection: 'row',
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

const UserAvatarHeader = ({
  firstName,
  lastName,
  location,
  navigation,
  disabled,
  isLoading,
}) => (
    <Container source={{ uri: 'https://picsum.photos/375/812/?random' }}>
      <DarkOverlay />
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
    </Container>
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
