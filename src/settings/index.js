import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { useMutation } from 'react-apollo';
import { SafeAreaView, ScrollView, withNavigation } from 'react-navigation';
import { getVersion } from 'react-native-device-info';

import {
  styled,
  BackgroundView,
  FlexedView,
  BodyText,
} from '@apollosproject/ui-kit';
import { LOGOUT } from '@apollosproject/ui-auth';

import { TableView, Cell } from '../ui/TableView';
import { UserWebBrowserConsumer } from '../user-web-browser';
import { RowFeedHeaderComponent } from '../content-feed/RowFeed';

import PersonalInformation from './PersonalInformation';

const VersionText = styled(({ theme }) => ({
  fontSize: 14,
  marginBottom: theme.sizing.baseUnit * 2.5,
}))(BodyText);

const Settings = ({ navigation, title }) => {
  const [handleLogout] = useMutation(LOGOUT);

  return (
    <BackgroundView>
      <SafeAreaView
        forceInset={{ bottom: 'always', top: 'never' }}
        style={{ flex: 1 }}
      >
        <RowFeedHeaderComponent navigation={navigation} title={title} />
        <View style={{ flex: 10 }}>
          <ScrollView>
            <PersonalInformation />

            <UserWebBrowserConsumer>
              {(openUrl) => (
                <TableView title="App Information">
                  <Cell
                    icon="list"
                    title="Terms & Conditions"
                    onPress={() =>
                      openUrl(
                        'https://beta.christfellowship.church/terms-of-use'
                      )
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
                onPress={() => handleLogout()}
              />
            </TableView>
          </ScrollView>
        </View>
      </SafeAreaView>
    </BackgroundView>
  );
};

Settings.defaultProps = {
  title: 'Settings',
};

Settings.propTypes = {
  title: PropTypes.string,
};

Settings.navigationOptions = {
  header: null,
};

export default withNavigation(Settings);
