import React, { PureComponent } from 'react';
import { ScrollView } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
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

import { GET_LOGIN_STATE, LOGOUT } from '@apollosproject/ui-auth';

const AvatarView = styled({
  alignItems: 'center',
  justifyContent: 'center',
})(PaddedView);

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
      <Query query={GET_LOGIN_STATE} fetchPolicy="cache-and-network">
        {({ data: { isLoggedIn = false, loading } }) => {
          if (loading) return <ActivityIndicator />;
          if (!isLoggedIn) return null;
          return (
            <BackgroundView>
              <ScrollView>
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
                        <Mutation mutation={LOGOUT}>
                          {(handleLogout) => (
                            <Touchable
                              onPress={async () => {
                                await handleLogout();

                                const navigationAction = NavigationActions.navigate({
                                  routeName: 'LandingScreen',
                                  params: {},
                                  action: NavigationActions.navigate({ routeName: 'Identity' })
                                })
                                this.props.navigation.dispatch(navigationAction)
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
              </ScrollView>
            </BackgroundView>
          );
        }}
      </Query>
    );
  }
}

export default UserSettings;
