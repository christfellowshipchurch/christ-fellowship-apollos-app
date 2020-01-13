import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { get } from 'lodash';

import { ContentCard, ErrorCard } from '@apollosproject/ui-kit';
import {
  formatDate,
  getStartDateFromEvents,
} from 'ChristFellowship/src/utils/events';
import GET_CONTENT_CARD from './query';

export { BASE_CARD_FRAGMENT } from './query';
// TODO: Replace passing a Card as a prop with using the component mapper.
// export contentCardComponentMapper from './contentCardComponentMapper';

export {
  TILE_CARD_FRAGMENT,
  LARGE_CARD_FRAGMENT,
  ACCESSORY_FRAGMENT,
} from './query';

const ContentCardConnected = ({
  contentId,
  isLoading,
  tile,
  card,
  ...otherProps
}) => {
  if (!contentId || isLoading)
    return React.createElement(card, {
      ...otherProps,
      tile,
      isLoading: true,
      title: '',
    });

  return (
    <Query query={GET_CONTENT_CARD} variables={{ contentId, tile: !!tile }}>
      {({ data: { node = {} } = {}, loading, error }) => {
        if (error) return <ErrorCard error={error} />;

        const metrics = [
          {
            icon: node.isLiked ? 'like-solid' : 'like',
            value: node.likedCount,
          },
        ];

        const typename = get(node, '__typename', '');
        const coverImage = get(node, 'coverImage.sources', undefined);
        const label =
          typename === 'EventContentItem'
            ? getStartDateFromEvents(node)
            : get(otherProps, 'label', '');

        return React.createElement(card, {
          ...node,
          ...otherProps,
          coverImage,
          // metrics,
          tile,
          isLoading: loading,
          label,
          labelText: label, // for the Highlight Card
        });
      }}
    </Query>
  );
};

ContentCardConnected.propTypes = {
  isLoading: PropTypes.bool,
  contentId: PropTypes.string,
  tile: PropTypes.bool,
  card: PropTypes.func,
};

ContentCardConnected.defaultProps = {
  card: ContentCard,
};

export default ContentCardConnected;
