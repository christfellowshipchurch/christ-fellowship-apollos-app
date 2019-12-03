import React from 'react'
import PropTypes from 'prop-types'
import { Query } from 'react-apollo'
import { get } from 'lodash'

<<<<<<< ours
import { ContentCard, ErrorCard } from '@apollosproject/ui-kit'
import GET_CONTENT_CARD from './query'
import { formatDate } from 'ChristFellowship/src/utils/events'
=======
export { BASE_CARD_FRAGMENT } from './query';
export contentCardComponentMapper from './contentCardComponentMapper';
>>>>>>> theirs

export { TILE_CARD_FRAGMENT, LARGE_CARD_FRAGMENT, ACCESSORY_FRAGMENT } from './query'

const ContentCardConnected = ({
  contentId,
  isLoading,
  tile,
  card = ContentCard,
  ...otherProps
}) => {
  if (!contentId || isLoading)
    return React.createElement(
      card,
      {
        ...otherProps,
        tile,
        isLoading: true
      }
    )

  return (
    <Query query={GET_CONTENT_CARD} variables={{ contentId, tile: !!tile }}>
      {({ data: { node = {} } = {}, loading, error }) => {
        if (error) return <ErrorCard error={error} />

        const metrics = [
          {
            icon: node.isLiked ? 'like-solid' : 'like',
            value: node.likedCount,
          },
        ]

        const typename = get(node, '__typename', '')
        const coverImage = get(node, 'coverImage.sources', undefined)
        const label = typename === 'EventContentItem'
          ? formatDate(node)
          : get(otherProps, 'label', '')

        return React.createElement(
          card,
          {
            ...node,
            ...otherProps,
            coverImage,
            metrics,
            tile,
            isLoading: loading,
            label,
          }
        )
      }}
    </Query>
  )
}

ContentCardConnected.propTypes = {
  isLoading: PropTypes.bool,
  contentId: PropTypes.string,
  tile: PropTypes.bool,
  card: PropTypes.func
}

// ContentCardConnected.defaultProps = {
//   card: ContentCard
// }

export default ContentCardConnected
