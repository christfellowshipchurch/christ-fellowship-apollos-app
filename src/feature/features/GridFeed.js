import React from 'react';
import { View, FlatList } from 'react-native';
import { useQuery } from '@apollo/react-hooks';
import { get, first, chunk, drop, uniqueId, take } from 'lodash';
import { withNavigation } from 'react-navigation';
import PropTypes from 'prop-types';
import { withProps } from 'recompose';

import { styled, TouchableScale, withMediaQuery } from '@apollosproject/ui-kit';

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

const GridFeed = ({
    title,
    itemId,
    isLoading,
    numColumns,
    mapData,
    renderItem,
}) => {
    const { loading, error, data } = useQuery(GET_CONTENT_FEED, {
        fetchPolicy: 'cache-and-network',
        variables: {
            itemId,
        },
    });

    if (isLoading || loading) return <HighlightCard isLoading />;

    return (
        <FlatList
            data={mapData(data)}
            renderItem={renderItem}
            keyExtractor={(item) => uniqueId(item.id)}
            removeClippedSubviews={false}
            numColumns={numColumns}
        />
    );
};

GridFeed.propTypes = {
    title: PropTypes.string,
    itemId: PropTypes.string,
    numColumns: PropTypes.number,
};

export default withMediaQuery(
    ({ md }) => ({ maxWidth: md }),
    withProps({
        numColumns: 1,
        mapData: (data) => {
            const allNodes = get(
                data,
                'node.childContentItemsConnection.edges',
                []
            ).map(({ node }) => node);

            return [[first(allNodes)], ...chunk(drop(allNodes), 2)];
        },
        renderItem: ({ item, index }) => {
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
                <Touchable itemId={itemId} style={{ flex: 1 }}>
                    <ContentCardConnected
                        contentId={itemId}
                        card={index === 0 ? HighlightCard : RowCard}
                        Component={index === 0 ? HighlightCard : RowCard}
                    />
                </Touchable>
            );
        },
    }),
    withProps({
        numColumns: 2,
        mapData: (data) => {
            const allNodes = get(
                data,
                'node.childContentItemsConnection.edges',
                []
            ).map(({ node }) => node);

            return [[first(allNodes)], ...chunk(drop(allNodes), 3)];
        },
        renderItem: ({ item, index }) => {
            if (item.length > 1) {
                return (
                    <View style={{ flex: 1 }}>
                        <CardColumnRow>
                            {take(item, 2).map(({ id }, i) => (
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
                        {item.length === 3 && (
                            <Touchable style={{ flex: 1 }}>
                                <ContentCardConnected
                                    contentId={get(item, '[2].id')}
                                    card={RowCard}
                                    Component={RowCard}
                                />
                            </Touchable>
                        )}
                    </View>
                );
            }

            const itemId = get(item, '[0].id');
            return (
                <Touchable itemId={itemId} style={{ flex: 1 }}>
                    <ContentCardConnected
                        contentId={itemId}
                        card={HighlightCard}
                        Component={HighlightCard}
                    />
                </Touchable>
            );
        },
    })
)(GridFeed);
