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
import { formatDate } from 'ChristFellowship/src/utils/events'

const EventContentItemRow = ({
  title,
  summary,
  startDate,
  endDate,
  coverImage,
  loading
}) => {
  return <TileRowCard
    label={formatDate({ startDate, endDate })}
    title={title}
    summary={summary}
    coverImage={coverImage.sources}
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
  } = useQuery(GET_EVENTS, { fetchPolicy: 'cache-and-network' })

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