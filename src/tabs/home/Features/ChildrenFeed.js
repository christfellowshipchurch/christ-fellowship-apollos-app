import React from 'react';
import { View } from 'react-native';
import { useQuery } from '@apollo/react-hooks';
import { get } from 'lodash';
import { withNavigation } from 'react-navigation';

import {
    styled,
    TouchableScale,
    DefaultCard,
    FlexedView,
} from '@apollosproject/ui-kit';

import ContentCardConnected from '../../../ui/ContentCardConnected';
import { TileRowCard, HighlightCard, RowCard } from '../../../ui/Cards';
import GET_CONTENT_FEED from '../../../content-feed/getContentFeed';

import { SectionHeader } from '../components';

const StyledFlexedView = styled(({ theme }) => ({
    flexDirection: 'column',
}))(FlexedView);

const StyledTouchableScale = styled(({ theme }) => ({
    // paddingVertical: theme.sizing.baseUnit
}))(TouchableScale);

const ChildrenFeed = ({ title, itemId, navigation, titleColor }) => {
    const { loading, error, data } = useQuery(GET_CONTENT_FEED, {
        fetchPolicy: 'cache-and-network',
        variables: { itemId, first: 4 },
    });

    return (
        <View>
            <SectionHeader
                title={title}
                color={titleColor}
                callToAction="See All"
                onPress={() => {
                    navigation.navigate('RowContentFeed', {
                        itemId,
                        itemTitle: title,
                    });
                }}
            />
            <StyledFlexedView>
                {get(data, 'node.childContentItemsConnection.edges', []).map(
                    ({ node }, i) => (
                        <StyledTouchableScale
                            key={`ChildrenFeed:${itemId}${i}`}
                            onPress={() =>
                                navigation.navigate('ContentSingle', { itemId: node.id })
                            }
                        >
                            <ContentCardConnected
                                isLoading={loading}
                                contentId={node.id}
                                card={i === 0 ? HighlightCard : RowCard}
                            />
                        </StyledTouchableScale>
                    )
                )}
            </StyledFlexedView>
        </View>
    );
};

export default withNavigation(ChildrenFeed);
