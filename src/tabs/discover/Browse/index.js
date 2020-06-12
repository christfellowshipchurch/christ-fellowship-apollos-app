import React, { useState } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import { get, first } from 'lodash';

import { ErrorCard } from '@apollosproject/ui-kit';

import Categories from './Categories';
import Filters from './Filters';
import { GET_FILTERS } from './queries';

const mapFilters = (data) => get(data, 'browseFilters', []);

export const Browse = ({ filters, isLoading, error }) => {
    const [active, setActive] = useState(get(first(filters), 'id', null));

    if (error) return <ErrorCard />;

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
    error: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.string,
        PropTypes.object,
    ]),
};

const BrowseConnected = () => {
    const { loading, error, data } = useQuery(GET_FILTERS, {
        fetchPolicy: 'cache-and-network',
    });

    return (
        <Browse filters={mapFilters(data)} isLoading={loading} error={error} />
    );
};

export default BrowseConnected;
