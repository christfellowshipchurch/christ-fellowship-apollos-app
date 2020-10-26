import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { get } from 'lodash';
import moment from 'moment';

import { LiveConsumer } from '@apollosproject/ui-connected';
import { ContentCard, ErrorCard } from '@apollosproject/ui-kit';
import { HorizontalPrayerRequestCard, HorizontalGroupCard } from '../Cards';
import GET_CONTENT_CARD from './query';

const ContentCardConnected = ({
  contentId,
  isLoading,
  tile,
  card,
  ...otherProps
}) => {
  if (!contentId || isLoading)
    return React.createElement(card, {
      isLoading: true,
      title: '',
      coverImage: [],
    });

  return (
    <LiveConsumer contentId={contentId}>
      {(liveStream) => (
        <Query query={GET_CONTENT_CARD} variables={{ contentId, tile: !!tile }}>
          {({ data: { node = {} } = {}, loading, error }) => {
            if (error && !loading && !node) return <ErrorCard error={error} />;

            // const metrics = [
            //   {
            //     icon: node.isLiked ? 'like-solid' : 'like',
            //     value: node.likedCount,
            //   },
            // ]

            let cardComponent = card;
            const typename = get(node, '__typename', '');
            const coverImage = get(node, 'coverImage.sources', undefined);
            let label = get(otherProps, 'label', '');
            const isLive = !!(liveStream && liveStream.isLive);
            const typenameProps = {};

            if (typename === 'EventContentItem') {
              const hideLabel = get(node, 'hideLabel', false);
              const comingSoon = hideLabel ? '' : 'Dates Coming Soon';

              label = node.events.length
                ? moment(get(node, 'nextOccurrence', new Date())).format(
                  'MMM D'
                )
                : comingSoon;
            }

            if (typename === 'PrayerRequest') {
              cardComponent = HorizontalPrayerRequestCard;
            }

            if (typename === 'Group' || typename === 'VolunteerGroup') {
              cardComponent = HorizontalGroupCard;

              typenameProps.heroAvatars = get(node, 'leaders.edges', []).map(
                ({ node }) => node.photo
              );
              typenameProps.totalHeroAvatars = get(
                node,
                'leaders.totalCount',
                0
              );

              typenameProps.avatars = get(node, 'members.edges', []).map(
                ({ node }) => node.photo
              );
              typenameProps.totalAvatars = get(node, 'members.totalCount', 0);
            }

            return React.createElement(cardComponent, {
              ...node,
              ...otherProps,
              ...typenameProps,
              coverImage,
              // metrics,
              tile,
              isLoading: loading,
              label,
              labelText: label, // for the Highlight Card
              isLiked: null, // hide the heart icon
              isLive,
            });
          }}
        </Query>
      )}
    </LiveConsumer>
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
