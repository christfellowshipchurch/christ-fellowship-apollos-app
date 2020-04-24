import React, { useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import { get } from 'lodash';

import StatusBar from '../../ui/StatusBar';
import { navigationOptions, BackgroundView } from '../../navigation';

import FilterRow from './FilterRow';
import CategoryList from './CategoryList';
import { GET_FILTERS } from './queries';

const Browse = ({ title }) => {
  const [activeFilter, setActiveFilter] = useState(null);
  const { loading, error, data } = useQuery(GET_FILTERS, {
    fetchPolicy: 'cache-and-network',
    onCompleted: (data) => {
      if (!activeFilter) {
        setActiveFilter(
          get(
            data,
            'getBrowseFilters[0].childContentItemsConnection.edges[0].node.id',
            null
          )
        );
      }
    },
  });

  if (loading) return <ActivityIndicator />;

  return (
    <BackgroundView>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar />
        <View style={{ flex: 1 }}>
          <FilterRow
            filters={get(
              data,
              'getBrowseFilters[0].childContentItemsConnection.edges',
              []
            ).map((edge) => edge.node)}
            onChange={({ id }) => {
              setActiveFilter(id);
            }}
            selected={activeFilter}
          />
        </View>
        <View style={{ flex: 5 }}>
          {!!activeFilter && <CategoryList filterId={activeFilter} />}
        </View>
      </SafeAreaView>
    </BackgroundView>
  );
};

Browse.navigationOptions = (props) =>
  navigationOptions({ ...props, title: 'Browse' });

Browse.propTypes = {
  title: PropTypes.string,
};

Browse.defaultProps = {
  title: 'Browse',
};

export default Browse;
