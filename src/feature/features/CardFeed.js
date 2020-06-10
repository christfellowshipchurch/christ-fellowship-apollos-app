import React from 'react';
import { View, FlatList } from 'react-native';
import { useQuery } from '@apollo/react-hooks';
import { get, first, chunk, drop } from 'lodash';
import { withNavigation } from 'react-navigation';
import PropTypes from 'prop-types';
import { withProps } from 'recompose';

import {
    styled,
    TouchableScale,
    withTheme,
    H3,
    ButtonLink,
    withMediaQuery,
} from '@apollosproject/ui-kit';

import { HeroCardFeed } from 'ui/CardFeeds';
import ContentCardConnected from '../../ui/ContentCardConnected';
import { HighlightCard, RowCard } from '../../ui/Cards';
import GET_CONTENT_FEED from '../../content-feed/getContentFeed';

const RowHeader = styled(({ theme }) => ({
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    zIndex: 2, // UX hack to improve tapability. Positions RowHeader above StyledHorizontalTileFeed
    paddingHorizontal: theme.sizing.baseUnit,
    marginBottom: theme.sizing.baseUnit * 0.25,
}))(View);

const AndroidTouchableFix = withTheme(({ theme }) => ({
    width: '25%',
    borderRadius: theme.sizing.baseUnit / 2,
}))(TouchableScale);

const ButtonLinkSpacing = styled(({ theme }) => ({
    flexDirection: 'row', // correctly positions the loading state
    justifyContent: 'flex-end', // correctly positions the loading state
    padding: theme.sizing.baseUnit, // UX hack to improve tapability.
    marginBottom: theme.sizing.baseUnit * -1 + 3,
    marginRight: theme.sizing.baseUnit * -1,
}))(View);

const StyledButtonLink = styled(({ theme }) => ({
    fontWeight: 'bold',
    color: theme.colors.lightTertiary,
    fontSize: 12,
}))(ButtonLink);

const SectionHeader = ({ title, onPress, callToAction }) => (
    <RowHeader>
        <View style={{ width: '75%' }}>
            <H3>{title}</H3>
        </View>
        {!!onPress && (
            <AndroidTouchableFix onPress={onPress}>
                <ButtonLinkSpacing>
                    <StyledButtonLink>{callToAction}</StyledButtonLink>
                </ButtonLinkSpacing>
            </AndroidTouchableFix>
        )}
    </RowHeader>
);

const mapData = (data) =>
    get(data, 'node.childContentItemsConnection.edges', []).map(
        ({ node }) => node
    );

const CardFeed = ({
    title,
    itemId,
    navigation,
    isLoading,
    numColumns,
    renderItem,
}) => {
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

export default withMediaQuery(
    ({ md }) => ({ maxWidth: md }),
    withProps({
        numColumns: 1,
        mapData: ({ data, navigation, isLoading }) =>
            get(data, 'node.childContentItemsConnection.edges', []).map(
                ({ node }) => ({
                    ...node,
                    onPress: () =>
                        navigation.navigate('ContentSingle', { itemId: node.id }),
                    isLoading,
                })
            ),
        renderItem: ({ item, index }) => (
            <TouchableScale onPress={item.onPress}>
                <ContentCardConnected
                    contentId={item.id}
                    card={index === 0 ? HighlightCard : RowCard}
                    Component={index === 0 ? HighlightCard : RowCard}
                />
            </TouchableScale>
        ),
    }),
    withProps({
        numColumns: 2,
        mapData: ({ data, navigation, isLoading }) => {
            const allNodes = get(
                data,
                'node.childContentItemsConnection.edges',
                []
            ).map(({ node }) => ({
                ...node,
                onPress: () =>
                    navigation.navigate('ContentSingle', { itemId: node.id }),
                isLoading,
            }));

            return [[first(allNodes)], ...chunk(drop(allNodes), 3)];
        },
        renderItem: ({ item, index }) => {
            if (item.length === 1)
                return (
                    <View style={{ flex: 1 }}>
                        <TouchableScale onPress={first(item).onPress}>
                            <ContentCardConnected
                                contentId={first(item).id}
                                card={HighlightCard}
                                Component={HighlightCard}
                            />
                        </TouchableScale>
                    </View>
                );

            return (
                <View style={{ flex: 1 }}>
                    {item.map(({ id, onPress }) => (
                        <TouchableScale onPress={onPress}>
                            <ContentCardConnected
                                contentId={id}
                                card={RowCard}
                                Component={RowCard}
                            />
                        </TouchableScale>
                    ))}
                </View>
            );
        },
    })
)(withNavigation(CardFeed));
