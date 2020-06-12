import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { get } from 'lodash';
import { withNavigation } from 'react-navigation';
import PropTypes from 'prop-types';

import { HeroCardFeed } from 'ui/CardFeeds';
import { RowCard } from 'ui/Cards';
import GET_CONTENT_FEED from '../../content-feed/getContentFeed';

const mapData = (data) =>
    get(data, 'node.childContentItemsConnection.edges', []).map(
        ({ node }) => node
    );

const CardFeed = ({ title, itemId, navigation }) => {
    const { loading, error, data } = useQuery(GET_CONTENT_FEED, {
        fetchPolicy: 'cache-and-network',
        variables: { itemId, first: 4 },
    });

    return (
        <HeroCardFeed
            navigation={navigation}
            content={mapData(data)}
            isLoading={loading}
            error={error}
            removeClippedSubviews={false}
            card={RowCard}
            title={title}
            parentId={itemId}
            onPressHeader={() => {
                navigation.navigate('ContentFeed', {
                    itemId,
                    itemTitle: title,
                    nested: true,
                });
            }}
        />
    );
};

CardFeed.propTypes = {
    title: PropTypes.string,
    itemId: PropTypes.string,
    navigation: PropTypes.shape({
        navigate: PropTypes.func,
    }),
};

export default withNavigation(CardFeed);
