import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { useMutation } from '@apollo/react-hooks';
import { SafeAreaView, ScrollView, withNavigation } from 'react-navigation';
import { getVersion } from 'react-native-device-info';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import {
  styled,
  withTheme,
  BackgroundView,
  FlexedView,
  BodyText,
  Touchable,
} from '@apollosproject/ui-kit';

import { LOGOUT } from '@apollosproject/ui-auth';
import NavigationService from '../NavigationService';

import { navigationOptions } from '../tabs/navigation';

import { TableView, Cell } from '../ui/TableView';
import { UserWebBrowserConsumer } from '../user-web-browser';

import PersonalInformation from './PersonalInformation';

const VersionText = styled(({ theme }) => ({
  fontSize: 14,
  marginBottom: theme.sizing.baseUnit * 2.5,
}))(BodyText);

const HeaderTouchable = styled(({ theme, withTransparency }) => ({
  marginHorizontal: theme.sizing.baseUnit,
  opacity: withTransparency ? 0.5 : 1,
}))(Touchable);

const CrossIcon = withTheme(({ theme }) => ({
  icon: ['fal', 'times'],
  fill: theme.colors.text.primary,
  size: 24,
}))(FontAwesomeIcon);

const Settings = () => {
  const [handleLogout] = useMutation(LOGOUT);

  return (
    <BackgroundView>
      <SafeAreaView forceInset={{ bottom: 'always', top: 'never' }}>
        <ScrollView>
          <PersonalInformation />

          <UserWebBrowserConsumer>
            {(openUrl) => (
              <TableView title="App Information">
                <Cell
                  icon="list"
                  title="Terms & Conditions"
                  onPress={() =>
                    openUrl('https://beta.christfellowship.church/terms-of-use')
                  }
                />
                <Cell
                  icon="lock"
                  title="Privacy Policy"
                  onPress={() =>
                    openUrl(
                      'https://beta.christfellowship.church/privacy-policy'
                    )
                  }
                />
                <Cell
                  icon="envelope"
                  title="Send Feedback"
                  onPress={() =>
                    openUrl('https://beta.christfellowship.church')
                  }
                />
              </TableView>
            )}
          </UserWebBrowserConsumer>

          <FlexedView
            style={{ justifyContent: 'center', alignItems: 'center' }}
          >
            <VersionText>{`Version ${getVersion()}`}</VersionText>
          </FlexedView>

          <TableView>
            <Cell
              icon="share-square"
              title="Log Out"
              onPress={async () => {
                await handleLogout();
                // This resets the navigation stack, and the navigates to the first auth screen.
                // This ensures that user isn't navigated to a subscreen of Auth, like the pin entry screen.
                await NavigationService.resetToAuth();
              }}
            />
          </TableView>
        </ScrollView>
      </SafeAreaView>
    </BackgroundView>
  );
};

Settings.defaultProps = {};

Settings.propTypes = {};

Settings.navigationOptions = ({ navigation, theme }) => ({
  headerStyle: navigationOptions.headerStyle,
  title: 'Settings',
  headerTitleStyle: {
    ...navigationOptions.headerTitleStyle,
    color: theme === 'dark' ? 'white' : 'black',
  },
  headerRight: (
    <HeaderTouchable
      onPress={() => navigation.goBack(null)}
      disabled={navigation.getParam('isLoading')}
      withTransparency
    >
      <CrossIcon />
    </HeaderTouchable>
  ),
  headerLeft: null,
});

export default withNavigation(Settings);
