import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash'

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
  marginLeft: theme.sizing.baseUnit,
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
        {filters.map((n, i) => (
          <Touchable
            onPress={() => onChange(i)}
            key={i}
          >
            <FilterButton style={{ height: '100%' }}>
              <StyledH5 active={selected === i}>
                {get(n, 'title', '')}
              </StyledH5>
            </FilterButton>
          </Touchable>
        ))}
      </Container>
    </View>
  )
}

FilterRow.propTypes = {
  filters: PropTypes.array,
  selected: PropTypes.number,
  onChange: PropTypes.func,
}

FilterRow.defaultProps = {
  filters: [],
  selected: 0,
  onChange: () => true,
}

export default FilterRow