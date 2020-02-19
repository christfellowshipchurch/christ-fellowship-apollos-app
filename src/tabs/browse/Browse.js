import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import { get, has } from 'lodash';

import { View, SafeAreaView, ScrollView } from 'react-native';
import { FlexedView, H3, styled } from '@apollosproject/ui-kit';

import { HeaderSpacer, navigationOptions, BackgroundView } from '../navigation';

import FilterRow from './FilterRow';
import CategoryList from './CategoryList';
import { GET_FILTERS } from './queries';

const HeaderTitle = styled(({ theme, active }) => ({
  fontWeight: 'bold',
  textAlign: 'center',
  paddingTop: theme.sizing.baseUnit,
}))(H3);

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

  return (
    <BackgroundView>
      <SafeAreaView style={{ height: '100%' }}>
        <HeaderSpacer />
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
        {!!activeFilter && <CategoryList filterId={activeFilter} />}
      </SafeAreaView>
    </BackgroundView>
  );
};

Browse.navigationOptions = ({ theme }) => ({
  ...navigationOptions,
  headerTitleStyle: {
    ...navigationOptions.headerTitleStyle,
    color: theme === 'dark' ? 'white' : 'black',
  },
  title: 'Browse',
});

Browse.propTypes = {
  title: PropTypes.string,
};

Browse.defaultProps = {
  title: 'Browse',
};

export default Browse;
