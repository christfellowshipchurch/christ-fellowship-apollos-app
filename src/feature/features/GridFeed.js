import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { get } from 'lodash';
import { withNavigation } from 'react-navigation';
import PropTypes from 'prop-types';

import { GridCardFeed } from 'ui/CardFeeds';
import GET_CONTENT_FEED from '../../content-feed/getContentFeed';

const mapData = (data) =>
    get(data, 'node.childContentItemsConnection.edges', []).map(
        ({ node }) => node
    );

const GridFeed = ({ itemId, navigation }) => {
    const { loading, error, data } = useQuery(GET_CONTENT_FEED, {
        fetchPolicy: 'cache-and-network',
        variables: {
            itemId,
        },
    });

    console.log({ data });

    return (
        <GridCardFeed
            content={mapData(data)}
            removeClippedSubviews={false}
            navigation={navigation}
            isLoading={loading}
            error={error}
        />
    );
};

GridFeed.propTypes = {
    itemId: PropTypes.string,
    navigation: PropTypes.shape({
        navigate: PropTypes.func,
    }),
};

export default withNavigation(GridFeed);
