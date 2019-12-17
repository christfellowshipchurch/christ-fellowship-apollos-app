import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { get } from 'lodash';

import { ErrorCard } from '@apollosproject/ui-kit';

import { LiveConsumer } from '../../live/LiveContext';
import contentCardComponentMapper from './contentCardComponentMapper';
import GET_CONTENT_CARD from './query';

const ContentCardConnected = memo(
  ({ Component, contentId, isLoading, tile, mapProps, ...otherProps }) => {
    if (!contentId || isLoading)
      return <Component {...otherProps} isLoading tile={tile} />;

    return (
      <LiveConsumer contentId={contentId}>
        {(liveStream) => (
          <Query query={GET_CONTENT_CARD} variables={{ contentId }}>
            {({ data: { node = {} } = {}, loading, error }) => {
              if (error) return <ErrorCard error={error} />;

              const coverImage = get(node, 'coverImage.sources', undefined);
              const hasMedia = !!get(node, 'videos.[0].sources[0]', null);
              const isLive = !!liveStream;
              const labelText = get(node, 'parentChannel.name', '');

              return (
                <Component
                  {...node}
                  hasAction={hasMedia}
                  isLive={isLive}
                  labelText={isLive ? 'Live' : labelText}
                  {...otherProps}
                  coverImage={coverImage}
                  isLoading={loading}
                />
              );
            }}
          </Query>
        )}
      </LiveConsumer>
    );
  }
);

ContentCardConnected.propTypes = {
  Component: PropTypes.func,
  mapProps: PropTypes.func,
  contentId: PropTypes.string,
  isLoading: PropTypes.bool,
  tile: PropTypes.bool,
};

ContentCardConnected.defaultProps = {
  Component: contentCardComponentMapper,
};

ContentCardConnected.displayName = 'ContentCardConnected';

export default ContentCardConnected;
