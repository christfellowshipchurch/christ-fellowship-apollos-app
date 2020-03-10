import React from 'react';
import { withNavigation } from 'react-navigation';

import {
    styled,
    TouchableScale,
    HorizontalTileFeed,
} from '@apollosproject/ui-kit';

import ContentCardConnected from '../../../ui/ContentCardConnected';
import { TinyCard } from '../../../ui/Cards';
import { SectionHeader } from '../components';

const tinyCardRowLoadingObject = {
    id: 'fake_id',
    title: '',
    coverImage: [],
};

const StyledHorizontalTileFeed = styled(({ theme }) => ({
    /* UX hack to improve tapability. The magic number below happens to be the number of pixels that
         * aligns everything in the same place as if none of the UX hacks were there. */
    marginTop: theme.sizing.baseUnit * -0.5,
    paddingLeft: theme.sizing.baseUnit * 0.25,
    zIndex: 1,
}))(HorizontalTileFeed);

const TinyCardFeed = ({
    title,
    actions,
    isLoading = false,
    navigation,
    titleColor,
}) => (
        <>
            <SectionHeader
                title={title}
                color={titleColor}
                onPress={() => {
                    navigation.navigate('Browse');
                }}
                callToAction="See All"
            />
            <StyledHorizontalTileFeed
                loadingStateObject={tinyCardRowLoadingObject}
                content={actions.map((n) => n.relatedNode)}
                isLoading={isLoading}
                renderItem={({ item }) => (
                    <TouchableScale
                        onPress={() => {
                            navigation.push('ContentSingle', {
                                itemId: item.id,
                            });
                        }}
                    >
                        <ContentCardConnected
                            card={TinyCard}
                            contentId={item.id}
                            inHorizontalList
                        />
                    </TouchableScale>
                )}
            />
        </>
    );

export default withNavigation(TinyCardFeed);
