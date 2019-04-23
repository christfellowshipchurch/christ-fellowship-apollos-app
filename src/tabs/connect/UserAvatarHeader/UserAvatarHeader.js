import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { withNavigation } from 'react-navigation';

import UserAvatarView from 'ChristFellowship/src/ui/UserAvatarView';

import {
  withIsLoading,
  Touchable,
  Icon,
  withTheme,
  styled,
  PaddedView,
  FlexedView,
} from '@apollosproject/ui-kit';

const Container = styled(({ theme }) => ({
  alignItems: 'center',
  flexDirection: 'row',
  paddingTop: theme.sizing.baseUnit * 2,
  paddingBottom: 0,
}))(PaddedView);

const SettingsIcon = compose(
  withTheme(({ theme }) => ({
    name: 'settings',
    fill: theme.colors.text.tertiary,
  }))
)(Icon);

const UserAvatarHeader = ({
  firstName,
  lastName,
  location,
  navigation,
  disabled,
  isLoading,
}) => (
  <Container>
    <FlexedView>
      <UserAvatarView
        firstName={firstName}
        lastName={lastName}
        location={location}
        disabled={disabled}
        isLoading={isLoading}
      />
    </FlexedView>
    <Touchable onPress={() => navigation.navigate('UserSettings')}>
      <SettingsIcon />
    </Touchable>
  </Container>
);

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
};

export default withNavigation(withIsLoading(UserAvatarHeader));
