import React, { useState } from 'react'
import { useQuery } from 'react-apollo'
import PropTypes from 'prop-types'
import { get, camelCase } from 'lodash'

import {
  View,
  FlatList,
  Animated,
  ScrollView
} from 'react-native'
import {
  FeedView,
  BackgroundView,
  Button,
  ButtonLink,
  FlexedView,
  Touchable,
  H5,
  styled,
} from '@apollosproject/ui-kit'

import { GET_FILTERS } from '../queries'

const StyledH5 = styled(({ theme, active }) => ({
  color: active ? theme.colors.darkPrimary : theme.colors.darkSecondary,
  fontWeight: active ? "bold" : "normal"
}))(H5)

const FilterButton = styled(({ theme }) => ({
  justifyContent: 'center',
  alignItems: 'center',
  paddingHorizontal: theme.sizing.baseUnit * 0.5,
}))(View)

const Container = styled(({ theme }) => ({
  marginLeft: theme.sizing.baseUnit * 0.5,
}))(ScrollView)

const FilterRow = ({
  filters,
  selected,
  onChange
}) => {
  return (
    <View style={{ height: 40 }}>
      <Container
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {filters.map((n, i) => {
          const title = get(n, 'title', '')
          const id = get(n, 'id', '')

          return (
            <Touchable
              onPress={() => onChange({ title, id })}
              key={i}
            >
              <FilterButton style={{ height: '100%' }}>
                <StyledH5
                  active={selected === id}
                >
                  {title}
                </StyledH5>
              </FilterButton>
            </Touchable>
          )
        })}
      </Container>
    </View>
  )
}

FilterRow.propTypes = {
  filters: PropTypes.array,
  selected: PropTypes.string,
  onChange: PropTypes.func,
}

FilterRow.defaultProps = {
  filters: [],
  selected: null,
  onChange: () => true,
}

export default FilterRow