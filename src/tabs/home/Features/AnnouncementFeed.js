import React from 'react';
import { View } from 'react-native';
import { useQuery } from '@apollo/react-hooks';
import { get, first, chunk, drop } from 'lodash';
import { withNavigation } from 'react-navigation';

import {
    styled,
    TouchableScale,
    FlexedView,
    // HighlightCard,
    FeaturedCard,
} from '@apollosproject/ui-kit';

import ContentCardConnected from '../../../ui/ContentCardConnected';

import {
    TileRowCard,
    StackedImageCard,
    HighlightCard,
    ColumnCard,
    RowCard,
} from '../../../ui/Cards';

import GET_CONTENT_FEED from '../../../content-feed/getContentFeed';

const StyledHighlightCard = styled(({ theme }) => ({
    // paddingVertical: theme.sizing.baseUnit * 0.5,
}))(HighlightCard);

const StyledRowCard = styled(({ theme }) => ({
    paddingVertical: theme.sizing.baseUnit * 0.5,
}))(RowCard);

const CardColumnRow = styled(({ theme }) => ({
    flexDirection: 'row',
    marginVertical: -theme.sizing.baseUnit * 0.25,
}))(FlexedView);

const ColumnTouchableScale = styled(({ }) => ({
    width: '50%',
}))(TouchableScale);

const cardLoadingObject = {
    id: 'fake_id',
    title: '',
    coverImage: [],
};

const CardColumns = ({ cards, navigation }) => (
    <CardColumnRow>
        {cards.map(({ node }, i) => (
            <ColumnTouchableScale
                key={`AnnoucementFeed:${node.id}${i}`}
                onPress={() =>
                    navigation.navigate('ContentSingle', { itemId: node.id })
                }
            >
                <ContentCardConnected
                    contentId={node.id}
                    card={ColumnCard}
                    placement={i % 2 === 0 ? 'left' : 'right'}
                />
            </ColumnTouchableScale>
        ))}
    </CardColumnRow>
);
const CardRow = ({ node, navigation }) => (
    <TouchableScale
        key={`AnnoucementFeed:${node.id}`}
        onPress={() => navigation.navigate('ContentSingle', { itemId: node.id })}
    >
        <ContentCardConnected contentId={node.id} card={RowCard} />
    </TouchableScale>
);

const AnnoumcementFeed = ({ itemId, navigation }) => {
    const { loading, error, data } = useQuery(GET_CONTENT_FEED, {
        fetchPolicy: 'cache-and-network',
        variables: { itemId },
    });

    if (loading)
        return <StyledHighlightCard isLoading={loading} {...cardLoadingObject} />;

    const content = get(data, 'node.childContentItemsConnection.edges', []);
    const { node: topCard } = first(content);
    const groupedCards = chunk(drop(content), 2);

    return (
        <FlexedView>
            {topCard && (
                <TouchableScale
                    key={`AnnoucementFeed:${topCard.id}`}
                    onPress={() =>
                        navigation.navigate('ContentSingle', { itemId: topCard.id })
                    }
                >
                    <ContentCardConnected
                        contentId={topCard.id}
                        card={StyledHighlightCard}
                    />
                </TouchableScale>
            )}

            {groupedCards.map(
                (group, i) =>
                    group.length > 1 ? (
                        <CardColumns
                            cards={group}
                            navigation={navigation}
                            key={`AnnouncementFeed:Group:${i}`}
                        />
                    ) : (
                            <CardRow
                                {...group[0]}
                                navigation={navigation}
                                key={`AnnouncementFeed:Group:${i}`}
                            />
                        )
            )}
        </FlexedView>
    );
};

export default withNavigation(AnnoumcementFeed);
