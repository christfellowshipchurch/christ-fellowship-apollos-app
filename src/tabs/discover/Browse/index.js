import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import { get, first, capitalize, find } from 'lodash';

import { ErrorCard } from '@apollosproject/ui-kit';

import Categories from './Categories';
import Filters from './Filters';
import { GET_FILTERS } from './queries';

const mapFilters = (data) => get(data, 'browseFilters', []);

export const Browse = ({
  filters,
  isLoading,
  error,
  activeFilter,
  navigation,
}) => {
  const [active, setActive] = useState(null);

  useEffect(() => setActive(activeFilter), [activeFilter]);

  if (error) return <ErrorCard />;

  return (
    <View>
      <Filters
        data={filters}
        active={active}
        onPress={({ id }) => setActive(id)}
        isLoading={isLoading}
      />
      <Categories
        filterId={active}
        isLoading={isLoading}
        navigation={navigation}
      />
    </View>
  );
};

Browse.propTypes = {
  filters: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
    })
  ),
  isLoading: PropTypes.bool,
  error: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
    PropTypes.object,
  ]),
  activeFilter: PropTypes.string,
};

const BrowseConnected = ({ selectedFilter, navigation }) => {
  const { loading, error, data } = useQuery(GET_FILTERS, {
    fetchPolicy: 'cache-and-network',
  });

  const filters = mapFilters(data);
  const firstFilter = get(first(filters), 'id', null);
  const passedFilter = get(
    find(
      filters,
      (filter) => capitalize(filter.title) === capitalize(selectedFilter)
    ),
    'id',
    null
  );

  return (
    <Browse
      filters={filters}
      activeFilter={passedFilter || firstFilter}
      isLoading={loading}
      error={error}
      navigation={navigation}
    />
  );
};

BrowseConnected.propTypes = {
  selectedFilter: PropTypes.string,
};

export default BrowseConnected;
