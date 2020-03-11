import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { View, ScrollView } from 'react-native';
import { Touchable, H5, styled, withTheme } from '@apollosproject/ui-kit';

const StyledH5 = styled(({ theme, active }) => ({
  color: active ? theme.colors.text.primary : theme.colors.text.secondary,
  fontWeight: active ? 'bold' : 'normal',
  paddingVertical: theme.sizing.baseUnit,
}))(H5);

const FilterButton = styled(({ theme }) => ({
  justifyContent: 'center',
  alignItems: 'center',
  paddingHorizontal: theme.sizing.baseUnit * 0.5,
}))(View);

const Container = withTheme(({ theme }) => ({
  style: {
    paddingLeft: theme.sizing.baseUnit * 0.5,
    width: '100%',
  },
  contentContainerStyle: {
    alignItems: 'flex-end',
  },
}))(ScrollView);

const FilterRow = ({ filters, selected, onChange }) => (
  <Container horizontal showsHorizontalScrollIndicator={false}>
    {filters.map((n, i) => {
      const title = get(n, 'title', '');
      const id = get(n, 'id', '');

      return (
        <Touchable onPress={() => onChange({ title, id })} key={i}>
          <FilterButton>
            <StyledH5 active={selected === id}>{title}</StyledH5>
          </FilterButton>
        </Touchable>
      );
    })}
  </Container>
);

FilterRow.propTypes = {
  filters: PropTypes.array,
  selected: PropTypes.string,
  onChange: PropTypes.func,
};

FilterRow.defaultProps = {
  filters: [],
  selected: null,
  onChange: () => true,
};

export default FilterRow;
