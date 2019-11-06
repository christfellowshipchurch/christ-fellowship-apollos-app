import React from 'react'
import { View } from 'react-native'
import { withNavigation } from 'react-navigation'
import { useQuery } from 'react-apollo'
import PropTypes from 'prop-types'
import { get, take } from 'lodash'

import {
  styled,
  withTheme,
  H3,
  H5,
  H6,
  HorizontalTileFeed,
  ButtonLink,
  TouchableScale,
  Touchable,
  withIsLoading,
} from '@apollosproject/ui-kit'

import { TinyCard } from 'ChristFellowship/src/ui/Cards'
import ContentCardConnected from '../../../ui/ContentCardConnected'
import {
  GET_CATEGORY_PREVIEW
} from '../queries'

const RowHeader = styled(({ theme }) => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'flex-end',
  zIndex: 2, // UX hack to improve tapability. Positions RowHeader above StyledHorizontalTileFeed
  paddingTop: theme.sizing.baseUnit * 0.5,
  paddingLeft: theme.sizing.baseUnit,
}))(View)

const Name = styled(({ theme }) => ({
  width: '75%',
  flexGrow: 2,
  paddingBottom: theme.sizing.baseUnit, // should match the ButtonLinkSpacing in case that element doesn't show
}))(View)

const AndroidTouchableFix = withTheme(({ theme }) => ({
  width: '25%',
  borderRadius: theme.sizing.baseUnit / 2,
}))(Touchable)

const ButtonLinkSpacing = styled(({ theme }) => ({
  flexDirection: 'row', // correctly positions the loading state
  justifyContent: 'flex-end', // correctly positions the loading state
  padding: theme.sizing.baseUnit, // UX hack to improve tapability.
}))(View)

const StyledHorizontalTileFeed = styled(({ theme }) => ({
  /* UX hack to improve tapability. The magic number below happens to be the number of pixels that
   * aligns everything in the same place as if none of the UX hacks were there. */
  marginTop: theme.sizing.baseUnit * -1.25,
  zIndex: 1,
}))(HorizontalTileFeed)

const loadingStateObject = {
  id: 'fake_id',
  title: '',
  coverImage: [],
}

const CategoryContentTileFeed = ({
  id,
  navigation,
}) => {
  const { loading, error, data, refetch } = useQuery(
    GET_CATEGORY_PREVIEW,
    {
      variables: { id }
    }
  )

  const title = get(data, 'node.title', '')
  const content = get(data, 'node.childContentItemsConnection.edges', []).map(
    edges => edges.node
  )

  return content.length
    ? (
      <>
        <RowHeader>
          <Name>
            <H3>{title}</H3>
          </Name>
          {/* TODO : > 5 */}
          {content.length &&
            <AndroidTouchableFix
              onPress={() => {
                console.log({ id })
                navigation.navigate('RowContentFeed', {
                  itemId: id,
                  title
                })
              }}
            >
              <ButtonLinkSpacing>
                <H6>
                  <ButtonLink>See More</ButtonLink>
                </H6>
              </ButtonLinkSpacing>
            </AndroidTouchableFix>}
        </RowHeader>
        <StyledHorizontalTileFeed
          content={take(content, 5)}
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
                isLoading={loading}
                inHorizontalList
              />
            </TouchableScale>
          )}
          loadingStateObject={loadingStateObject}
          isLoading={loading}
        />
      </>
    )
    : null
}

CategoryContentTileFeed.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
  isLoading: PropTypes.bool,
  id: PropTypes.string,
  filter: PropTypes.string,
  category: PropTypes.string,
  name: PropTypes.string,
  content: PropTypes.arrayOf(
    PropTypes.any // this component doesn't care about the shape of `node`, just that it exists
  ),
}

export default withNavigation(withIsLoading(CategoryContentTileFeed))
