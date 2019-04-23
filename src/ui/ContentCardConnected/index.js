import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { get } from 'lodash';

import { ContentCard, ErrorCard } from '@apollosproject/ui-kit';
import getContentCard from './query';

export { tileCardFragment, largeCardFragment } from './query';

const ContentCardConnected = ({
  contentId,
  isLoading,
  tile,
  ...otherProps
}) => {
  if (!contentId || isLoading)
    return <ContentCard {...otherProps} isLoading tile={tile} />;

  return (
    <Query query={getContentCard} variables={{ contentId, tile: !!tile }}>
      {({ data: { node = {} } = {}, loading, error }) => {
        if (error) return <ErrorCard error={error} />;

        const metrics = [
          {
            icon: node.isLiked ? 'like-solid' : 'like',
            value: node.likedCount,
          },
        ];

        const coverImage = get(node, 'coverImage.sources', undefined);

        return (
          <ContentCard
            {...node}
            {...otherProps}
            coverImage={coverImage}
            metrics={metrics}
            tile={tile}
            isLoading={loading}
          />
        );
      }}
    </Query>
  );
};

ContentCardConnected.propTypes = {
  isLoading: PropTypes.bool,
  contentId: PropTypes.string,
  tile: PropTypes.bool,
};

export default ContentCardConnected;
