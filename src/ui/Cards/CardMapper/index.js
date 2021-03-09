/**
 * CardMapper.js
 *
 * Author: Caleb Panza
 * Created: Feb 08, 2021
 *
 * This component accepts a collection of properties that can be rendered as a part of a Card. It then infers what type of Card to render to best represent the final collection of data.
 *
 * A Card Component can be manually passed in to bypass the auto-mapping of the UI Element.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { get, isEmpty } from 'lodash';
import { useQuery } from '@apollo/client';

import { transformISODates } from 'utils/string';
import { useLiveStream } from 'hooks';

import { ImageSourceType } from '@apollosproject/ui-kit';
import HighlightCard from '../HighlightCard';
import HorizontalPrayerRequestCard from '../HorizontalPrayerRequestCard';
import GroupCard from '../GroupCard';

import GET_CARD_PARTS from './getCardParts';

/**
 * note : so this isn't the most elegant way to do this, BUT! it's what we gotta do. Right now, there's an issue with the `skip` property of `useQuery` where it doesn't actually skip and sends all kinds of network requests with empty Id's. This causes a lot of noise and unwanted errors on the API. This wrapper component will requeire that an Id be passed with it. Only render this component if you're positive that you have an Id
 */
const ConnectedCard = ({ __typename, id, labelText, Component, ...props }) => {
  const skip = !id || isEmpty(id);
  const { data } = useQuery(GET_CARD_PARTS, {
    skip,
    variables: { nodeId: id },
    fetchPolicy: skip ? 'cache-only' : 'cache-and-network',
  });

  let cardProps = {};
  const node = data?.node;

  /**
   * If we have a live stream id in the relatedNode, lets check for a Live Stream node
   */
  const { isLive } = useLiveStream({
    liveStreamId: node?.liveStream?.id,
  });

  switch (__typename) {
    case 'Group':
    case 'VolunteerGroup':
      cardProps = {
        ...node,
        // Group Card Props
        heroAvatars: get(node, 'leaders.edges', []).map(
          ({ node: leaderNode }) => leaderNode.photo
        ),
        totalHeroAvatars: get(node, 'leaders.totalCount', 0),
        avatars: get(node, 'members.edges', []).map(
          ({ node: memberNode }) => memberNode.photo
        ),
        totalAvatars: get(node, 'members.totalCount', 0),
      };

      break;
    case 'PrayerRequest':
      cardProps = {
        ...cardProps,
        ...node,
      };
      break;
    case 'ContentItem':
    default:
      /**
       * Default case should be any Content Item
       */
      cardProps = {
        ...cardProps,
        labelText: transformISODates(
          node?.labelText ? node?.labelText : labelText
        ),
      };
      break;
  }

  return <Component {...cardProps} {...props} isLive={isLive} />;
};

const CardMapper = ({
  __typename,
  relatedNode,
  Component,
  isLoading,
  coverImage,
  title,
  summary,
  tile,
  labelText,
  inHorizontalList,
}) => {
  const skip = !relatedNode || !relatedNode?.id || isEmpty(relatedNode?.id);

  /**
   * If we have a live stream id in the relatedNode, lets check for a Live Stream node
   */

  let FinalComponent = null;
  const cardProps = {
    __typename,
    isLoading,
    title,
    summary,
    coverImage,
    tile,
    labelText,
    inHorizontalList,
  };

  switch (__typename) {
    case 'Group':
    case 'VolunteerGroup':
      FinalComponent = GroupCard;
      break;
    case 'PrayerRequest':
      FinalComponent = HorizontalPrayerRequestCard;
      break;
    case 'ContentItem':
    default:
      /**
       * Default case should be any Content Item
       */
      FinalComponent = HighlightCard;
      /**
       * If a Component was specified to our Map, let's use that instead of the calculated Component
       */

      if (Component) FinalComponent = Component;
      break;
  }

  if (skip) {
    return (
      <FinalComponent
        {...cardProps}
        labelText={transformISODates(cardProps?.labelText)}
      />
    );
  }

  return (
    <ConnectedCard
      id={relatedNode?.id}
      Component={FinalComponent}
      {...cardProps}
      labelText={transformISODates(cardProps?.labelText)}
    />
  );
};

CardMapper.propTypes = {
  __typename: PropTypes.string,
  relatedNode: PropTypes.shape({
    id: PropTypes.string,
  }),
  title: PropTypes.string,
  summary: PropTypes.string,
  labelText: PropTypes.string,
  Component: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
  isLoading: PropTypes.bool,
  coverImage: ImageSourceType,
  isLive: PropTypes.bool,
  tile: PropTypes.bool,
  inHorizontalList: PropTypes.bool,
};

CardMapper.defaultProps = {
  Component: null, // note : the Component is defaulted to `null` to indicate the automatic mapping should be used
  isLoading: false,
  tile: false,
};

export default CardMapper;
