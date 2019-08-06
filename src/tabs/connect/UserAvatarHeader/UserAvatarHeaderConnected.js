import React, { useState } from 'react'
import { View, ScrollView, StyleSheet, Animated, StatusBar, Text } from 'react-native'
import { Query } from 'react-apollo'
import PropTypes from 'prop-types'
import { get } from 'lodash'

import GET_USER_PROFILE from '../getUserProfile'
import UserAvatarHeader from './UserAvatarHeader'

const HEADER_MIN_HEIGHT = 150
const HEADER_MAX_HEIGHT = 375
const scrollRangeForAnimation = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scrollView: {
    flex: 1,
    zIndex: 1
  }
})

const UserAvatarHeaderConnected = ({ navigation, children }) => {
  let _scrollView = null
  const [scrollY, setScrollY] = useState(new Animated.Value(0))
  const animationRange = scrollY.interpolate({
    inputRange: [0, scrollRangeForAnimation],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  })
  const onScrollEndSnapToEdge = event => {
    const y = event.nativeEvent.contentOffset.y;
    if (0 < y && y < scrollRangeForAnimation / 2) {
      if (_scrollView) {
        _scrollView.scrollTo({ y: 0 });
      }
    } else if (scrollRangeForAnimation / 2 <= y && y < scrollRangeForAnimation) {
      if (_scrollView) {
        _scrollView.scrollTo({ y: scrollRangeForAnimation });
      }
    }
  }

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
              navigation={navigation}
              disabled
              animationRange={animationRange}
              scrollRangeForAnimation={scrollRangeForAnimation}
            />
            <ScrollView
              style={{
                flex: 1,
                zIndex: -1
              }}
              ref={scrollView => {
                _scrollView = scrollView ? scrollView._component : null;
              }}
              scrollEventThrottle={16}
              onScrollEndDrag={onScrollEndSnapToEdge}
              onMomentumScrollEnd={onScrollEndSnapToEdge}
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
