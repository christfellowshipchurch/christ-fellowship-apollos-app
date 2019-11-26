import React from 'react'
import { View } from 'react-native'
import { useQuery } from 'react-apollo'
import { get } from 'lodash'
import PropTypes from 'prop-types'
import { withNavigation } from 'react-navigation'

import {
    TouchableScale,
    ContentCard
} from '@apollosproject/ui-kit'

import ContentCardConnected from 'ChristFellowship/src/ui/ContentCardConnected'
import { TileRowCard } from 'ChristFellowship/src/ui/Cards'
import GET_CONTENT_FEED from 'ChristFellowship/src/content-feed/getContentFeed'

import { SectionHeader } from '../components'

const ChildrenFeed = ({
    title,
    itemId,
    navigation,
    titleColor
}) => {
    const {
        loading,
        error,
        data,
    } = useQuery(GET_CONTENT_FEED, {
        fetchPolicy: "cache-and-network",
        variables: { itemId, first: 4 }
    })

    return <View>
        <SectionHeader
            title={title}
            color={titleColor}
            callToAction='See All'
            onPress={() => {
                navigation.navigate('RowContentFeed', {
                    itemId,
                    itemTitle: title
                })
            }}
        />
        {get(data, 'node.childContentItemsConnection.edges', []).map(({ node }, i) =>
            <TouchableScale
                key={`ChildrenFeed:${itemId}${i}`}
                onPress={() =>
                    navigation.navigate(
                        'ContentSingle',
                        { itemId }
                    )
                }
            >
                <ContentCardConnected
                    isLoading={loading}
                    contentId={node.id}
                    {...node}
                    card={i === 0 ? ContentCard : TileRowCard}
                />
            </TouchableScale>
        )}
    </View>
}

export default withNavigation(ChildrenFeed)
