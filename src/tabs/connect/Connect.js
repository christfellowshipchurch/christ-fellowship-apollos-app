import React, { PureComponent } from 'react'
import { Text, View } from 'react-native'
import { Query } from 'react-apollo'
import { get } from 'lodash'
import PropTypes from 'prop-types'

import { GET_LOGIN_STATE } from '@apollosproject/ui-auth'
import {
  BackgroundView,
} from '@apollosproject/ui-kit'
import ActionTable from './ActionTable'
import UserAvatarHeader from '../../ui/UserAvatarHeader'

const Connect = ({ navigation }) => (
  <BackgroundView>
    <Query query={GET_LOGIN_STATE}>
      {({ data }) => {
        if (get(data, 'isLoggedIn', false))
          return (
            <UserAvatarHeader key="UserAvatarHeaderConnected" navigation={navigation}>
              <View style={{ height: 1000 }}>
                <ActionTable />
                <Text style={{ paddingHorizontal: 20 }}>Scroll up and down to see the Profile resize in real time</Text>
              </View>
              <ActionTable />
            </UserAvatarHeader>
          )

        // On logout or when not properly authenitcated
        // navigate back to the Identity screen of the Profile Stack navigator
        navigation.reset({
          routeName: 'Profile',
          params: {},
          action: navigation.navigate({ routeName: 'Identity' }),
        })

        return (
          <View></View>
        )
      }}
    </Query>
  </BackgroundView>
)

Connect.navigationOptions = {
  title: 'Connect',
  header: null
}

Connect.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
    navigate: PropTypes.func,
  }),
}

export default Connect
