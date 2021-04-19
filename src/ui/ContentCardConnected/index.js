import React from 'react';
import PropTypes from 'prop-types';
import { Query } from '@apollo/client/react/components';
import { get, flatten, uniqBy, head, last } from 'lodash';
import moment from 'moment';

import { LiveConsumer } from '@apollosproject/ui-connected';
import { ContentCard, ErrorCard } from '@apollosproject/ui-kit';
import { HorizontalPrayerRequestCard, GroupCard } from '../Cards';
import GET_CONTENT_CARD from './query';

const generateEventGroupingLabel = (eventGroups) => {
  if (eventGroups.length === 0) return null;
  /**
   * The following transformations need to be applied after getting the eventGroupings
   * Map to start dates                   : [ [date1Time, date1Time], [date2Time] ]
   * Flatten the array                    : [date1Time, date1Time, date2Time]
   * Filter to just get the unique dates  : [date1Time, date2Time]
   */
  let eventDates = eventGroups;
  eventDates = eventDates.map((grouping) =>
    grouping.instances.map(({ start }) => moment(start).format(''))
  );
  eventDates = flatten(eventDates);
  eventDates = uniqBy(eventDates, (date) => moment(date).format('MMDD'));

  if (eventDates.length === 0) return null;

  /**
   * If today with 1 date     : Today
   * If not today with 1 date : January 1
   * If more than 1 date      : Jan 1 - Jan 5
   */
  if (eventDates.length === 1) {
    const today = moment().format('MMMM D');
    const date = moment(eventDates[0]).format('MMMM D');

    return date === today ? 'Today' : date;
  }

  eventDates = eventDates.sort((a, b) => moment(a).diff(b));
  const firstDate = moment(head(eventDates)).format('MMM D');
  const lastDate = moment(last(eventDates)).format('MMM D');

  return `${firstDate} - ${lastDate}`;
};

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
              /**
               * If label is not null or an empty string, override the date duration
               * and use the custom label instead
               */
              const eventLabelOverride = get(node, 'label');
              if (!eventLabelOverride || eventLabelOverride === '') {
                label = generateEventGroupingLabel(
                  get(node, 'eventGroupings', [])
                );
              } else {
                label = eventLabelOverride;
              }
            }

            if (typename === 'PrayerRequest') {
              cardComponent = HorizontalPrayerRequestCard;
            }

            if (typename === 'Group' || typename === 'VolunteerGroup') {
              cardComponent = GroupCard;

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
