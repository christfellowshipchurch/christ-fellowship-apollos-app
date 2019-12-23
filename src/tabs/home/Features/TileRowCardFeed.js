import React from 'react';
import { View } from 'react-native';
import { withNavigation } from 'react-navigation';

import { styled, TouchableScale } from '@apollosproject/ui-kit';

import ContentCardConnected from 'ChristFellowship/src/ui/ContentCardConnected';
import { TileRowCard } from 'ChristFellowship/src/ui/Cards';
import { SectionHeader } from '../components';

const AdjustedView = styled(({ theme }) => ({
    marginHorizontal: theme.sizing.baseUnit * -1,
}))(View);

const TileRowCardFeed = ({
    title,
    actions,
    navigation,
    titleColor,
    callToAction,
    onPress,
}) => (
        <AdjustedView>
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
        </AdjustedView>
    );

TileRowCardFeed.propTypes = {};

TileRowCardFeed.defaultProps = {};

export default withNavigation(TileRowCardFeed);
