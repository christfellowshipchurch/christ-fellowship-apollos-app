import React, { useState } from 'react'
import { View, ScrollView, StyleSheet, Animated, StatusBar, Text } from 'react-native'
import { Query } from 'react-apollo'
import PropTypes from 'prop-types'
import { get } from 'lodash'

import GET_USER_PROFILE from './getUserProfile'
import UserAvatarHeader from './UserAvatarHeader'

const HEADER_MIN_HEIGHT = 150
const HEADER_MAX_HEIGHT = 375

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scrollView: {
    flex: 1,
    zIndex: 1
  }
})

const UserAvatarHeaderConnected = (props) => {
  const { children } = props
  const [scrollY, setScrollY] = useState(new Animated.Value(0))
  const animationRange = scrollY.interpolate({
    inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp'
  })

  return (
    <Query query={GET_USER_PROFILE} fetchPolicy="cache-and-network">
      {({
        data: {
          currentUser: {
            profile: { photo, firstName, lastName, campus } = {},
          } = {},
        } = {},
        refetch,
      }) => (
          <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <UserAvatarHeader
              firstName={firstName}
              lastName={lastName}
              location={get(campus, 'name')}
              photo={photo}
              refetch={refetch}
              disabled
              animation={{
                range: animationRange,
                minHeight: HEADER_MIN_HEIGHT,
                maxHeight: HEADER_MAX_HEIGHT
              }}
              {...props}
            />
            <ScrollView
              style={styles.scrollView}
              scrollEventThrottle={16}
              onScroll={Animated.event(
                [
                  {
                    nativeEvent: { contentOffset: { y: scrollY } },
                  },
                ],
                {
                  // useNativeDriver: true,
                }
              )} >
              <Animated.View style={{ height: HEADER_MAX_HEIGHT }}></Animated.View>
              {children}
            </ScrollView>
          </View>
        )}
    </Query>
  )
}

UserAvatarHeaderConnected.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
    navigate: PropTypes.func,
  }),
}

export default UserAvatarHeaderConnected
