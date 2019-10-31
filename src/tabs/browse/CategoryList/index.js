import React, { useState } from 'react'
import { useQuery } from 'react-apollo'
import PropTypes from 'prop-types'
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

const CategoryList = ({
  title,
  data
}) => {

  return (
    <ScrollView
      horizontal
    >
      {data.map((n, i) => (
        <H3 key={i}>
          {get(n, 'title', '')}
        </H3>
      ))}
    </ScrollView>
  )
}

CategoryList.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      image: {
        uri: PropTypes.string,
      },
      description: PropTypes.string,
      tag: PropTypes.string,
    })
  )
}

CategoryList.defaultProps = {
  data: [],
  image: {
    uri: null,
  },
  description: "",
  tag: "",
}

export default CategoryList