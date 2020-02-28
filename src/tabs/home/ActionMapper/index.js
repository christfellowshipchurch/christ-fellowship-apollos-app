import React from 'react';
import PropTypes from 'prop-types';
import { uniq, indexOf } from 'lodash';

import { TouchableScale, DefaultCard } from '@apollosproject/ui-kit';

import ContentCardConnected from '../../../ui/ContentCardConnected';
import {
    ChildrenFeed,
    AnnouncementFeed,
    TinyCardFeed,
    TileRowCardFeed,
} from '../Features';
import { ActionWrapper } from '../components';
import { COLOR_MAP } from '../Home';

const ACTION_TYPES = {
    event: 'READ_EVENT',
    content: 'READ_CONTENT',
    global: 'READ_GLOBAL_CONTENT',
    children: 'VIEW_CHILDREN',
};

const ActionMapper = ({
    title,
    subtitle,
    titleColor,
    actions,
    navigation,
    image,
    isLoading,
}) => {
    const actionTypes = uniq(actions.map(({ action }) => action));

    if (actionTypes.length === 1 && actionTypes.includes(ACTION_TYPES.event)) {
        // When the only action is to view Events
        return (
            <ActionWrapper>
                <TileRowCardFeed
                    title={title}
                    titleColor={titleColor}
                    isLoading={isLoading}
                    actions={actions}
                    callToAction="See All"
                    onPress={() => navigation.navigate('Events')}
                />
            </ActionWrapper>
        );
    }
    if (actionTypes.length === 1 && actionTypes.includes(ACTION_TYPES.content)) {
        // When the only action is to view Content
        return (
            <ActionWrapper>
                <TinyCardFeed
                    title={title}
                    actions={actions}
                    isLoading={isLoading}
                    titleColor={titleColor}
                />
            </ActionWrapper>
        );
    }

    return actions.map(({ title: actionTitle, action, relatedNode }, i) => {
        const startingColorIndex = indexOf(COLOR_MAP, titleColor);
        const actionTitleColor =
            COLOR_MAP[(startingColorIndex + i) % COLOR_MAP.length];
        const key = `ActionMapper:${i}`;
        let CardType = null;

        switch (action) {
            case ACTION_TYPES.global:
                // break
                return (
                    <ActionWrapper key={key}>
                        <AnnouncementFeed
                            itemId={relatedNode.id}
                            titleColor={actionTitleColor}
                        />
                    </ActionWrapper>
                );
            case ACTION_TYPES.children:
                return (
                    <ActionWrapper key={key}>
                        <ChildrenFeed
                            itemId={relatedNode.id}
                            title={actionTitle}
                            titleColor={actionTitleColor}
                        />
                    </ActionWrapper>
                );
            default:
                CardType = DefaultCard;
                break;
        }

        return (
            !!CardType && (
                <ActionWrapper key={key}>
                    <TouchableScale
                        onPress={() =>
                            navigation.navigate('ContentSingle', { itemId: relatedNode.id })
                        }
                    >
                        <ContentCardConnected
                            card={CardType}
                            contentId={relatedNode.id}
                            isLoading={isLoading}
                            coverImage={image}
                        />
                    </TouchableScale>
                </ActionWrapper>
            )
        );
    });
};

ActionMapper.propTypes = {
    title: PropTypes.string,
    subtitle: PropTypes.string,
    actions: PropTypes.array,
    isLoading: PropTypes.bool,
};

ActionMapper.defaultProps = {
    title: '',
    actions: [],
};

export default ActionMapper;
