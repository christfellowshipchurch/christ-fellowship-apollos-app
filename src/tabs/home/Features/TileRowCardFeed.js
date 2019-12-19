import React from 'react';
import { View } from 'react-native';
import { useQuery } from 'react-apollo';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import { withNavigation } from 'react-navigation';

import {
    withTheme,
    styled,
    H3,
    TouchableScale,
    HorizontalTileFeed,
    ButtonLink,
} from '@apollosproject/ui-kit';

import ContentCardConnected from 'ChristFellowship/src/ui/ContentCardConnected';
import { TileRowCard } from 'ChristFellowship/src/ui/Cards';
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

const TileRowCardFeed = ({ title, actions, navigation, titleColor }) => (
    <>
        <SectionHeader title={title} color={titleColor} />
        {actions.map(({ relatedNode }, i) => (
            <TouchableScale
                key={`TileRowCardFeed:${relatedNode.id}`}
                onPress={() => {
                    navigation.push('ContentSingle', {
                        itemId: relatedNode.id,
                    });
                }}
            >
                <ContentCardConnected card={TileRowCard} contentId={relatedNode.id} />
            </TouchableScale>
        ))}
    </>
);

TileRowCardFeed.propTypes = {};

TileRowCardFeed.defaultProps = {};

export default withNavigation(TileRowCardFeed);
