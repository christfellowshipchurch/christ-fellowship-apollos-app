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

import { ImageSourceType } from '@apollosproject/ui-kit';
import HighlightCard from '../HighlightCard';
import HorizontalPrayerRequestCard from '../HorizontalPrayerRequestCard';
import GroupCard from '../GroupCard';

import GET_CARD_PARTS from './getCardParts';

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
  ...props
}) => {
  /**
   * We use this query so that we could load up additional data about a card if we wanted to, but the card rendering is not reliant on this query
   */
  const { data } = useQuery(GET_CARD_PARTS, {
    skip: !relatedNode || !relatedNode?.id || isEmpty(relatedNode?.id),
    variables: { nodeId: relatedNode?.id },
    fetchPolicy: 'cache-and-network',
  });

  let FinalComponent = null;
  let cardProps = {
    isLoading,
    title,
    summary,
    coverImage,
    tile,
    labelText,
    inHorizontalList,
  };

  const node = data?.node;

  switch (__typename) {
    case 'Group':
    case 'VolunteerGroup':
      FinalComponent = GroupCard;
      cardProps = {
        ...cardProps,
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
      FinalComponent = HorizontalPrayerRequestCard;
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
      };
      FinalComponent = HighlightCard;
      /**
       * If a Component was specified to our Map, let's use that instead of the calculated Component
       */

      if (Component) FinalComponent = Component;
      break;
  }

  return <FinalComponent {...cardProps} />;
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
