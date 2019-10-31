import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useQuery } from 'react-apollo'
import { get } from 'lodash'

import { View, SafeAreaView, ScrollView } from 'react-native'
import {
  FlexedView,
  BackgroundView,
  H3,
  styled
} from '@apollosproject/ui-kit'

import FilterRow from './FilterRow'
import TileContentFeed from './TileContentFeed'
import { GET_FILTERS } from './queries'

const HeaderTitle = styled(({ theme, active }) => ({
  fontWeight: 'bold'
}))(H3)

const Browse = ({
  title,
}) => {
  const { loading, error, data } = useQuery(GET_FILTERS)
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <SafeAreaView style={{ height: '100%' }}>
      <FlexedView>
        <View
          style={{
            flex: 2,
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          <HeaderTitle>
            {title}
          </HeaderTitle>
        </View>

        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
          }}
        >
          <FilterRow
            filters={get(data, 'contentChannels[0].childContentItemsConnection.edges', [])
              .map((edge) => edge.node)
            }
            onChange={(i) => setActiveIndex(i)}
            selected={activeIndex}
          />
        </View>

        <View style={{ flex: 10, backgroundColor: 'gray' }}>

        </View>

      </FlexedView>
    </SafeAreaView>
  )
}

Browse.navigationOptions = {
  title: "Browse",
  header: null
}

Browse.propTypes = {
  title: PropTypes.string
}

Browse.defaultProps = {
  title: "Browse"
}

export default Browse