import React from 'react'
import { View } from 'react-native'
import { useQuery } from 'react-apollo'
import { get } from 'lodash'
import PropTypes from 'prop-types'
import { withNavigation } from 'react-navigation'

import {
    styled,
    H3,
    TouchableScale,
    FlexedView,
    FeaturedCard,
    HighlightCard
} from '@apollosproject/ui-kit'

import ContentCardConnected from 'ChristFellowship/src/ui/ContentCardConnected'
import { TileRowCard } from 'ChristFellowship/src/ui/Cards'
import GET_CONTENT_FEED from 'ChristFellowship/src/content-feed/getContentFeed'

const StyledFlexedView = styled(({ theme }) => ({

}))(FlexedView)

const AnnoumcementFeed = ({
    itemId,
    navigation
}) => {
    const {
        loading,
        error,
        data,
    } = useQuery(GET_CONTENT_FEED, {
        fetchPolicy: "cache-and-network",
        variables: { itemId, first: 4 }
    })

    return <StyledFlexedView>
        {get(data, 'node.childContentItemsConnection.edges', []).map(({ node }, i) =>
            <TouchableScale
                key={`AnnoucementFeed:${itemId}${i}`}
                onPress={() =>
                    navigation.navigate(
                        'ContentSingle',
                        { itemId: node.id }
                    )
                }
            >
                <ContentCardConnected
                    isLoading={loading}
                    contentId={node.id}
                    {...node}
                    coverImage={get(node, 'coverImage', null) || undefined}
                    card={i === 0 ? HighlightCard : TileRowCard}
                />
            </TouchableScale>
        )}
    </StyledFlexedView>
}

export default withNavigation(AnnoumcementFeed)
