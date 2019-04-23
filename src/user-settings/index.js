import React, { PureComponent } from 'react';

import PropTypes from 'prop-types';
import { Query, Mutation } from 'react-apollo';

import {
  BackgroundView,
  PaddedView,
  TableView,
  Cell,
  CellIcon,
  CellText,
  Divider,
  Touchable,
  styled,
  ActivityIndicator,
} from '@apollosproject/ui-kit';
import { WebBrowserConsumer } from 'ChristFellowship/src/ui/WebBrowser';
import AvatarForm from 'ChristFellowship/src/ui/UserAvatarView/AvatarForm';

import { getLoginState, logout } from '@apollosproject/ui-auth';

const AvatarView = styled({
  alignItems: 'center',
  justifyContent: 'center',
})(PaddedView);

const BackgroundContainer = styled(({ theme }) => ({
  paddingTop: theme.sizing.baseUnit * 1.75,
}))(BackgroundView);

class UserSettings extends PureComponent {
  static navigationOptions = () => ({
    title: 'Settings',
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
      navigate: PropTypes.func,
    }),
  };

  render() {
    return (
      <Query query={getLoginState} fetchPolicy="cache-and-network">
        {({ data: { isLoggedIn = false, loading } }) => {
          if (loading) return <ActivityIndicator />;
          if (!isLoggedIn) return null;
          return (
            <BackgroundContainer>
              <AvatarView>
                <AvatarForm text />
              </AvatarView>
              <WebBrowserConsumer>
                {(openUrl) => (
                  <BackgroundView>
                    <TableView>
                      <Touchable
                        onPress={async () => {
                          await this.props.navigation.navigate(
                            'PersonalDetails'
                          );
                        }}
                      >
                        <Cell>
                          <CellText>Personal Details</CellText>
                          <CellIcon name="arrow-next" />
                        </Cell>
                      </Touchable>
                      <Divider />
                      <Touchable
                        onPress={async () => {
                          await this.props.navigation.navigate('Location');
                        }}
                      >
                        <Cell>
                          <CellText>Location</CellText>
                          <CellIcon name="arrow-next" />
                        </Cell>
                      </Touchable>
                      <Divider />
                      <Touchable
                        onPress={async () => {
                          await this.props.navigation.navigate(
                            'ChangePassword'
                          );
                        }}
                      >
                        <Cell>
                          <CellText>Change Password</CellText>
                          <CellIcon name="arrow-next" />
                        </Cell>
                      </Touchable>
                    </TableView>
                    <TableView>
                      <Touchable
                        onPress={() =>
                          openUrl('https://apollosrock.newspring.cc/')
                        }
                      >
                        <Cell>
                          <CellText>Give Feedback</CellText>
                          <CellIcon name="arrow-next" />
                        </Cell>
                      </Touchable>
                    </TableView>
                    <TableView>
                      <Touchable
                        onPress={() =>
                          openUrl('https://apollosrock.newspring.cc/')
                        }
                      >
                        <Cell>
                          <CellText>Privacy Policy</CellText>
                          <CellIcon name="arrow-next" />
                        </Cell>
                      </Touchable>
                      <Divider />
                      <Touchable
                        onPress={() =>
                          openUrl('https://apollosrock.newspring.cc/')
                        }
                      >
                        <Cell>
                          <CellText>Terms of Use</CellText>
                          <CellIcon name="arrow-next" />
                        </Cell>
                      </Touchable>
                    </TableView>
                    <TableView>
                      <Mutation mutation={logout}>
                        {(handleLogout) => (
                          <Touchable
                            onPress={async () => {
                              await handleLogout();
                              await this.props.navigation.navigate('Connect');
                            }}
                          >
                            <Cell>
                              <CellText>Logout</CellText>
                              <CellIcon name="arrow-next" />
                            </Cell>
                          </Touchable>
                        )}
                      </Mutation>
                    </TableView>
                  </BackgroundView>
                )}
              </WebBrowserConsumer>
            </BackgroundContainer>
          );
        }}
      </Query>
    );
  }
}

export default UserSettings;
