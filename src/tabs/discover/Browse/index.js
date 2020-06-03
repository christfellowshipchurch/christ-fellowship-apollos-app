import React, { useState } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import { get, first } from 'lodash';

import Categories from './Categories';
import Filters from './Filters';
import { GET_FILTERS } from './queries';

const mapFilters = (data) => get(data, 'browseFilters', []);

export const Browse = ({ filters, isLoading }) => {
    const [active, setActive] = useState(get(first(filters), 'id', null));

    return (
        <View>
            <Filters
                data={filters}
                active={active}
                onPress={({ id }) => setActive(id)}
                isLoading={isLoading}
            />
            <Categories filterId={active} isLoading={isLoading} />
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
};

const BrowseConnected = () => {
    const { loading, error, data } = useQuery(GET_FILTERS, {
        fetchPolicy: 'cache-and-network',
    });

    return <Browse filters={mapFilters(data)} isLoading={loading} />;
};

export default BrowseConnected;
