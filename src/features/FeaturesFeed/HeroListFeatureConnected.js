import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { HeroListFeatureConnected as CoreHeroListFeatureConnected } from '@apollosproject/ui-connected';
import { HeroCardFeed } from 'ui/CardFeeds';

const HeroListFeature = ({
    actions = [],
    heroCard,
    id,
    isLoading,
    onPressHero: onPressHeroProp,
    onPressHeroListButton,
    onPressItem,
    subtitle,
    title,
    primaryAction,
}) => {
    const onPressHero = onPressHeroProp || onPressItem;
    const onPressActionListButton = onPressHeroListButton || onPressItem;

    /** The heroCard and actions need to be combined into a single array
     *  shaped in a way that ContentCardConnected can ingest it. Each of
     *  these do have 1 commonality, `relatedNode`, which holds the content
     *  item id. While this may not be the _most_ efficient way to handle this
     *  as far as caching goes, but it'll work. We also need to include the
     *  action for navigation.
     */
    const content = [heroCard, ...actions].map((item) => ({
        ...item,
        ...get(item, 'relatedNode', {}),
    }));

    return (
        <HeroCardFeed
            title={title}
            content={content}
            removeClippedSubviews={false}
            onPressItem={onPressActionListButton}
            isLoading={isLoading}
            key={id}
            onPressHero={onPressHero}
        />
    );
};

HeroListFeature.propTypes = {
    // TODO: refactor ActionListCard to safely render without an actions array.
    actions: PropTypes.arrayOf(PropTypes.shape({})).isRequired, // at least for the time being this is required
    heroCard: PropTypes.shape({}).isRequired, // at least for the time being this is required
    id: PropTypes.number,
    isLoading: PropTypes.bool,
    primaryAction: PropTypes.shape({
        title: PropTypes.string,
        relatedNode: PropTypes.shape({}),
    }),
    onPressHero: PropTypes.func,
    onPressHeroListButton: PropTypes.func,
    onPressItem: PropTypes.func,
    subtitle: PropTypes.string,
    title: PropTypes.string,
};

const HeroListFeatureConnected = (props) => (
    <CoreHeroListFeatureConnected {...props} Component={HeroListFeature} />
);

export default HeroListFeatureConnected;
