import React from 'react'
import { View } from 'react-native'
import { useQuery } from 'react-apollo'
import { get } from 'lodash'
import PropTypes from 'prop-types'
import { withNavigation } from 'react-navigation'

import {
    withTheme,
    styled,
    H3,
    TouchableScale,
    HorizontalTileFeed,
    ButtonLink
} from '@apollosproject/ui-kit'

import ContentCardConnected from 'ChristFellowship/src/ui/ContentCardConnected'
import { TinyCard } from 'ChristFellowship/src/ui/Cards'
import { SectionHeader } from '../components'

const tinyCardRowLoadingObject = {
    id: 'fake_id',
    title: '',
    coverImage: [],
}

const RowHeader = styled(({ theme }) => ({
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    zIndex: 2, // UX hack to improve tapability. Positions RowHeader above StyledHorizontalTileFeed
    paddingLeft: theme.sizing.baseUnit,
}))(View)

const Title = withTheme(({ theme, color }) => ({
    style: {
        color: theme.colors[color],
        marginTop: theme.sizing.baseUnit * 1.5,
    }
}))(H3)

const AndroidTouchableFix = withTheme(({ theme }) => ({
    width: '25%',
    borderRadius: theme.sizing.baseUnit / 2,
}))(TouchableScale)

const ButtonLinkSpacing = styled(({ theme }) => ({
    color: theme.colors.primary,
    flexDirection: 'row', // correctly positions the loading state
    justifyContent: 'flex-end', // correctly positions the loading state
    padding: theme.sizing.baseUnit, // UX hack to improve tapability.
    paddingBottom: theme.sizing.baseUnit * 1.5
}))(View)

const StyledHorizontalTileFeed = styled(({ theme }) => ({
    /* UX hack to improve tapability. The magic number below happens to be the number of pixels that
     * aligns everything in the same place as if none of the UX hacks were there. */
    marginTop: theme.sizing.baseUnit * -0.5,
    paddingLeft: theme.sizing.baseUnit * 0.25,
    zIndex: 1,
}))(HorizontalTileFeed)

const StyledButtonLink = styled(({ theme }) => ({
    fontWeight: 'bold',
    color: theme.colors.lightTertiary,
    fontSize: 12
}))(ButtonLink)

const TinyCardFeed = ({
    title,
    actions,
    isLoading = false,
    navigation,
    titleColor
}) => {
    return <>
        <SectionHeader
            title={title}
            color={titleColor}
            onPress={() => {
                navigation.navigate('Browse')
            }}
            callToAction='See All'
        />
        <StyledHorizontalTileFeed
            loadingStateObject={tinyCardRowLoadingObject}
            content={actions.map(n => n.relatedNode)}
            renderItem={({ item }) => (
                <TouchableScale
                    onPress={() => {
                        navigation.push('ContentSingle', {
                            itemId: item.id,
                        })
                    }}
                >
                    <ContentCardConnected
                        card={TinyCard}
                        contentId={item.id}
                        isLoading={isLoading}
                        inHorizontalList
                    />
                </TouchableScale>
            )}
        />
    </>
}

export default withNavigation(TinyCardFeed)
