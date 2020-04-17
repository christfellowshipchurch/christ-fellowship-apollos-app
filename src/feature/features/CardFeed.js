import React from 'react';
import { View, FlatList } from 'react-native';
import { useQuery } from '@apollo/react-hooks';
import { get } from 'lodash';
import { withNavigation } from 'react-navigation';
import PropTypes from 'prop-types';

import {
    styled,
    TouchableScale,
    FlexedView,
    withTheme,
    H3,
    ButtonLink,
} from '@apollosproject/ui-kit';

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

const mapData = (data, navigation) =>
    get(data, 'node.childContentItemsConnection.edges', []).map(({ node }) => ({
        ...node,
        onPress: () => navigation.navigate('ContentSingle', { itemId: node.id }),
    }));

const renderItem = ({ item, index }) => (
    <TouchableScale onPress={item.onPress}>
        <ContentCardConnected
            contentId={item.id}
            card={index === 0 ? HighlightCard : RowCard}
        />
    </TouchableScale>
);

const CardFeed = ({ title, itemId, navigation }) => {
    const { loading, error, data } = useQuery(GET_CONTENT_FEED, {
        fetchPolicy: 'cache-and-network',
        variables: { itemId, first: 4 },
    });

    return (
        <FlatList
            ListHeaderComponent={() => (
                <SectionHeader
                    title={title}
                    callToAction="See All"
                    onPress={() => {
                        navigation.navigate('RowContentFeed', {
                            itemId,
                            itemTitle: title,
                        });
                    }}
                />
            )}
            data={mapData(data, navigation)}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
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
