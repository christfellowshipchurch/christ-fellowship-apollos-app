import React from 'react'
import { uniq } from 'lodash'
import PropTypes from 'prop-types'

import {
    ContentCard,
    TouchableScale,
} from '@apollosproject/ui-kit'

import {
    ChildrenFeed,
    AnnouncementFeed,
    TinyCardFeed,
    TileRowCardFeed
} from '../Features'
import { ActionWrapper } from '../components'
import ContentCardConnected from 'ChristFellowship/src/ui/ContentCardConnected'

const ACTION_TYPES = {
    event: 'READ_EVENT',
    content: 'READ_CONTENT',
    global: 'READ_GLOBAL_CONTENT',
    children: 'VIEW_CHILDREN'
}

const ActionMapper = ({
    title,
    subtitle,
    titleColor,
    actions,
    navigation,
    image,
    isLoading
}) => {
    const actionTypes = uniq(actions.map(({ action }) => action))

    if (actionTypes.length === 1 && actionTypes.includes(ACTION_TYPES.event)) {
        // When the only action is to view Events
        return <ActionWrapper>
            <TileRowCardFeed
                title={title}
                titleColor={titleColor}
                isLoading={isLoading}
                actions={actions}
            />
        </ActionWrapper>
    } else if (actionTypes.length === 1 && actionTypes.includes(ACTION_TYPES.content)) {
        // When the only action is to view Content
        return <ActionWrapper>
            <TinyCardFeed
                title={title}
                actions={actions}
                isLoading={isLoading}
                titleColor={titleColor}
            />
        </ActionWrapper>
    }

    return actions.map(({ title: actionTitle, action, relatedNode }, i) => {
        const key = `ActionMapper:${i}`
        let CardType = null

        switch (action) {
            case ACTION_TYPES.global:
                // break
                return <ActionWrapper>
                    <AnnouncementFeed
                        key={key}
                        itemId={relatedNode.id}
                        titleColor={titleColor}
                    />
                </ActionWrapper>
            case ACTION_TYPES.children:
                return <ActionWrapper>
                    <ChildrenFeed
                        key={key}
                        itemId={relatedNode.id}
                        title={actionTitle}
                        titleColor={titleColor}
                    />
                </ActionWrapper>
            default:
                CardType = ContentCard
                break
        }

        return !!CardType && <ActionWrapper>
            <TouchableScale
                key={key}
                onPress={() =>
                    navigation.navigate(
                        'ContentSingle',
                        { itemId: relatedNode.id }
                    )
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
    })
}

ActionMapper.propTypes = {
    title: PropTypes.string,
    subtitle: PropTypes.string,
    actions: PropTypes.array,
    isLoading: PropTypes.bool
}

ActionMapper.defaultProps = {
    title: '',
    actions: []
}

export default ActionMapper