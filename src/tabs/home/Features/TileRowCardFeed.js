import React from 'react';
import { withNavigation } from 'react-navigation';

import { TouchableScale } from '@apollosproject/ui-kit';

import ContentCardConnected from 'ChristFellowship/src/ui/ContentCardConnected';
import { TileRowCard } from 'ChristFellowship/src/ui/Cards';
import { SectionHeader } from '../components';

const TileRowCardFeed = ({
    title,
    actions,
    navigation,
    titleColor,
    callToAction,
    onPress,
}) => (
        <>
            <SectionHeader
                title={title}
                color={titleColor}
                callToAction={callToAction}
                onPress={onPress}
            />
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
