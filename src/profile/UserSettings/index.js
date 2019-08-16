import React from 'react'
import { View, Text } from 'react-native'
import { get } from 'lodash'
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

import UserAvatarHeader from 'ChristFellowship/src/ui/UserAvatarHeader'
import { GET_LOGIN_STATE, LOGOUT } from '@apollosproject/ui-auth'
import GET_USER_LOGIN_TYPES from './getUserLoginTypes'
import ChangePassword from './ChangePassword'

const RowHeader = styled(({ theme }) => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingVertical: theme.sizing.baseUnit,
}))(PaddedView)

const RowLink = ({ title, icon, onPress }) => (
  <React.Fragment>
    <Touchable
      onPress={onPress}
    >
      <Cell>
        <CellIcon name={icon} />
        <CellText>{title}</CellText>
        <CellIcon name={'arrow-next'} />
      </Cell>
    </Touchable>
    <Divider />
  </React.Fragment>
)

const Name = styled({
  flexGrow: 1,
})(View)

const UserSettings = ({
  navigation,
  title = 'Account Settings',
  campusRowTitle = 'My Home Campus',
  logoutText = 'Log Out'
}) => (
    <Query query={GET_LOGIN_STATE} fetchPolicy="cache-and-network">
      {({ data: { isLoggedIn = false, loading } }) => {
        if (loading) return <ActivityIndicator />
        if (!isLoggedIn) return null

        return (
          <UserAvatarHeader
            title={title}
            navigation={navigation}
            edit >
            {({ campus }) => (
              <React.Fragment>
                <RowHeader>
                  <H4>{campusRowTitle}</H4>
                </RowHeader>
                <TableView>
                  <RowLink
                    title={get(campus, 'name', 'Select My Location')}
                    icon={'pin'}
                    onPress={() => navigation.navigate('Location')} />
                </TableView>

                <Query query={GET_USER_LOGIN_TYPES} fetchPolicy="cache-and-network">
                  {({
                    data: { getUserLoginTypes },
                    loading: lookingForUserLogins,
                    error
                  }) => {
                    if (lookingForUserLogins) return <ActivityIndicator />
                    if (error) return null

                    return get(getUserLoginTypes, 'email', false)
                      ? (
                        <React.Fragment>
                          <RowHeader>
                            <H4>Change My Password</H4>
                          </RowHeader>
                          <TableView>
                            <ChangePassword />
                          </TableView>
                        </React.Fragment>
                      ) : null
                  }}

                </Query>

                <TableView>
                  <Mutation mutation={LOGOUT}>
                    {(handleLogout) => (
                      <RowLink
                        title={logoutText}
                        icon={'umbrella'}
                        onPress={async () => {
                          // trigger handle logout
                          // rest of logout navigation and logic is handled on the Connect screen
                          await handleLogout()
                        }} />

                    )}
                  </Mutation>
                </TableView>
              </React.Fragment>
            )}
          </UserAvatarHeader>

        )
      }}
    </Query>
  )

export default UserSettings
