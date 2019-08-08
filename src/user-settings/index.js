import React from 'react'
import { View, Text } from 'react-native'
import { NavigationActions } from 'react-navigation'
import { Query, Mutation } from 'react-apollo'
import {
  PaddedView,
  TableView,
  Cell,
  CellIcon,
  CellText,
  Divider,
  Touchable,
  styled,
  ActivityIndicator,
  H4
} from '@apollosproject/ui-kit'

import { WebBrowserConsumer } from 'ChristFellowship/src/ui/WebBrowser'
import UserAvatarHeader from '../ui/UserAvatarHeader'
import { GET_LOGIN_STATE, LOGOUT } from '@apollosproject/ui-auth'

const RowHeader = styled(({ theme }) => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingVertical: theme.sizing.baseUnit,
}))(PaddedView)

const Name = styled({
  flexGrow: 1,
})(View)

const UserSettings = ({
  navigation
}) => (
    <Query query={GET_LOGIN_STATE} fetchPolicy="cache-and-network">
      {({ data: { isLoggedIn = false, loading } }) => {
        if (loading) return <ActivityIndicator />
        if (!isLoggedIn) return null

        return (
          <UserAvatarHeader
            title={'Account Settings'}
            navigation={navigation}
            edit >
            <WebBrowserConsumer>
              {(openUrl) => (
                <View style={{ height: 1000 }}>
                  <RowHeader>
                    <Name>
                      <H4>{'Coming Soon!'}</H4>
                      <Text>Scroll up and down to see the Profile resize in real time</Text>
                    </Name>
                  </RowHeader>
                  {/* <TableView>
                    <Touchable
                      onPress={() => openUrl('https://apollosrock.newspring.cc/page/235')}
                    >
                      <Cell>
                        <CellIcon name="check" />
                        <CellText>Find a serving opportunity</CellText>
                      </Cell>
                    </Touchable>
                    <Divider />
                    <Touchable
                      onPress={() => openUrl('https://apollosrock.newspring.cc/page/236')}
                    >
                      <Cell>
                        <CellIcon name="groups" />
                        <CellText>Join a small group</CellText>
                      </Cell>
                    </Touchable>
                    <Divider />
                    <Touchable
                      onPress={() => openUrl('https://apollosrock.newspring.cc/page/233')}
                    >
                      <Cell>
                        <CellIcon name="share" />
                        <CellText>I need prayer</CellText>
                      </Cell>
                    </Touchable>
                    <Divider />
                    <Touchable
                      onPress={() => openUrl('https://apollosrock.newspring.cc/page/186')}
                    >
                      <Cell>
                        <CellIcon name="download" />
                        <CellText>I would like to give</CellText>
                      </Cell>
                    </Touchable>
                  </TableView>
                  <TableView>
                    <Touchable
                      onPress={() => NavigationActions.navigate('TestingControlPanel')}
                    >
                      <Cell>
                        <CellIcon name="settings" />
                        <CellText>Open Testing Panel</CellText>
                      </Cell>
                    </Touchable>
                  </TableView> */}
                </View>
              )}
            </WebBrowserConsumer>
          </UserAvatarHeader>

        )
      }}
    </Query>
  )

export default UserSettings
