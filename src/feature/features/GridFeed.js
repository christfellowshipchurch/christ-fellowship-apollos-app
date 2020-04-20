import React from 'react';
import { View, FlatList } from 'react-native';
import { useQuery } from '@apollo/react-hooks';
import { get, first, chunk, drop, uniqueId } from 'lodash';
import { withNavigation } from 'react-navigation';
import PropTypes from 'prop-types';

import { styled, TouchableScale } from '@apollosproject/ui-kit';

import ContentCardConnected from '../../ui/ContentCardConnected';
import { HighlightCard, ColumnCard, RowCard } from '../../ui/Cards';
import GET_CONTENT_FEED from '../../content-feed/getContentFeed';

const CardColumnRow = styled(({ theme }) => ({
    flexDirection: 'row',
    marginVertical: -theme.sizing.baseUnit * 0.25,
}))(View);

const Touchable = withNavigation(({ itemId, navigation, children, style }) => (
    <TouchableScale
        style={style}
        onPress={() => navigation.navigate('ContentSingle', { itemId })}
    >
        {children}
    </TouchableScale>
));

const mapData = (data) => {
    const allNodes = get(data, 'node.childContentItemsConnection.edges', []).map(
        ({ node }) => node
    );

    return [[first(allNodes)], ...chunk(drop(allNodes), 2)];
};

const renderItem = ({ item, index }) => {
    if (item.length > 1) {
        return (
            <CardColumnRow>
                {item.map(({ id }, i) => (
                    <Touchable key={id} itemId={id} style={{ width: '50%' }}>
                        <ContentCardConnected
                            contentId={id}
                            card={ColumnCard}
                            Component={ColumnCard}
                            placement={i % 2 === 0 ? 'left' : 'right'}
                        />
                    </Touchable>
                ))}
            </CardColumnRow>
        );
    }

    const itemId = get(item, '[0].id');
    return (
        <Touchable itemId={itemId}>
            <ContentCardConnected
                contentId={itemId}
                card={index === 0 ? HighlightCard : RowCard}
                Component={index === 0 ? HighlightCard : RowCard}
            />
        </Touchable>
    );
};

const GridFeed = ({ title, itemId }) => {
    const { loading, error, data } = useQuery(GET_CONTENT_FEED, {
        fetchPolicy: 'cache-and-network',
        variables: {
            itemId,
        },
    });

    return (
        <FlatList
            data={mapData(data)}
            renderItem={renderItem}
            keyExtractor={(item) => uniqueId(item.id)}
            removeClippedSubviews={false}
            numColumns={1}
        />
    );
};

GridFeed.propTypes = {
    title: PropTypes.string,
    itemId: PropTypes.string,
};

export default GridFeed;
