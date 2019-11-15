import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useQuery } from 'react-apollo'
import { get } from 'lodash'
import moment from 'moment'

import {
  View,
  SafeAreaView
} from 'react-native'
import {
  FlexedView,
  BackgroundView,
  H3,
  FeedView,
  styled
} from '@apollosproject/ui-kit'

import { RowFeedHeaderComponent } from 'ChristFellowship/src/content-feed/RowFeed'
import { TileRowCard } from 'ChristFellowship/src/ui/Cards'
import ContentCardConnected from 'ChristFellowship/src/ui/ContentCardConnected'

import { GET_EVENTS } from './queries'

const formatDate = (props) => {
  const mStart = moment(get(props, 'startDate', new Date()))
  let mEnd = null
  const end = get(props, 'endDate', null)

  if (end) {
    mEnd = moment(end)
    const format = mStart.month() === mEnd.month()
      ? 'D'
      : 'MMM D'

    return `${mStart.format('MMM D')} - ${mEnd.format(format)}`
  }

  return mStart.format('MMM D')
}

const EventContentItemRow = ({
  title,
  startDate,
  endDate,
  coverImage,
  loading
}) => {
  return <TileRowCard
    label={formatDate({ startDate, endDate })}
    title={title}
    coverImage={coverImage}
    isLoading={loading}
  />
}

const Events = ({
  title,
  navigation
}) => {
  const {
    loading,
    error,
    data,
    refetch,
  } = useQuery(GET_EVENTS)

  /** Function that is called when a card in the feed is pressed.
     * Takes the user to the ContentSingle
     */
  const handleOnPress = (item) => {
    navigation.navigate('ContentSingle', {
      itemId: item.id,
      sharing: item.sharing,
    })
  }

  return (
    <BackgroundView style={{ flex: 1 }}>
      <RowFeedHeaderComponent
        navigation={navigation}
        title={title}
      />

      <View style={{ flex: 10 }}>
        <FeedView
          ListItemComponent={EventContentItemRow}
          content={get(data, 'allEvents', [])}
          isLoading={loading}
          error={error}
          refetch={refetch}
          onPressItem={handleOnPress}
        />
      </View>
    </BackgroundView >
  )
}

Events.propTypes = {
  title: PropTypes.string,
  navigation: PropTypes.any
}

Events.defaultProps = {
  title: "Events"
}

Events.navigationOptions = {
  header: null
}

export default Events