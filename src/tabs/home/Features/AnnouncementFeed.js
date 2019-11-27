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
import { TileRowCard, StackedImageCard } from 'ChristFellowship/src/ui/Cards'
import GET_CONTENT_FEED from 'ChristFellowship/src/content-feed/getContentFeed'

const StyledFlexedView = styled(({ theme }) => ({
    flexDirection: 'row',
    flexWrap: 'wrap'
}))(FlexedView)

const StyledTouchableScale = styled(({ theme, isRow, extraSpacing }) => ({
    width: isRow ? '100%' : '50%',
    ...(extraSpacing && {
        marginVertical: theme.sizing.baseUnit * 0.25
    })
}))(TouchableScale)

const cardLoadingObject = {
    id: 'fake_id',
    title: '',
    coverImage: [],
}

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

    if (loading) return <HighlightCard isLoading={loading} {...cardLoadingObject} />

    const content = get(data, 'node.childContentItemsConnection.edges', [])

    return <StyledFlexedView>
        {content.map(({ node }, i) => {
            const isRow = (content.length - 2) % 2 === 0 && i === content.length - 1
            let card = HighlightCard

            if (i > 0) {
                if (isRow) card = TileRowCard
                else card = StackedImageCard
            }

            return <StyledTouchableScale
                key={`AnnoucementFeed:${itemId}${i}`}
                onPress={() =>
                    navigation.navigate(
                        'ContentSingle',
                        { itemId: node.id }
                    )
                }
                isRow={isRow || i === 0}
                extraSpacing={isRow && i > 0}
            >
                <ContentCardConnected
                    contentId={node.id}
                    {...node}
                    coverImage={get(node, 'coverImage', null) || undefined}
                    card={card}
                />
            </StyledTouchableScale>
        })}
    </StyledFlexedView>
}

export default withNavigation(AnnoumcementFeed)