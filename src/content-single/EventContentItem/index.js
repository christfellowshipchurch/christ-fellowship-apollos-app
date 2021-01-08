import React from 'react';
import { ImageBackground } from 'react-native';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import {
  styled,
  PaddedView,
  GradientOverlayImage,
} from '@apollosproject/ui-kit';
import { HorizontalContentSeriesFeedConnected } from '@apollosproject/ui-connected';

import { HorizontalDivider } from 'ui/Dividers';
import ButtonWithLinkRouting from 'ui/ButtonWithLinkRouting';
import Color from 'color';
import Features from '../Features';
import EventGroupings from '../EventGroupings';
import Title from '../Title';
import HTMLContent from '../HTMLContent';

const StyledButton = styled(({ theme }) => ({
  marginVertical: theme.sizing.baseUnit * 0.5,
}))(ButtonWithLinkRouting);

const EventContentItem = ({ content, loading, ImageWrapperComponent }) => {
  const coverImageSources = get(content, 'coverImage.sources', []);
  const callsToAction = get(content, 'callsToAction', []);

  return (
    <>
      {coverImageSources.length || loading ? (
        <ImageWrapperComponent>
          <GradientOverlayImage
            isLoading={!coverImageSources.length && loading}
            source={coverImageSources}
            // Sets the ratio of the image
            minAspectRatio={1}
            maxAspectRatio={1}
            // Sets the ratio of the placeholder
            forceRatio={1}
            // No ratios are respected without this
            maintainAspectRatio
          />
        </ImageWrapperComponent>
      ) : null}

      <PaddedView>
        <Title contentId={content.id} isLoading={loading} />

        <EventGroupings contentId={content.id} />

        {callsToAction.length > 0 &&
          callsToAction.map((n) => (
            <StyledButton
              key={`${n.call}:${n.action}`}
              title={n.call}
              pill={false}
              url={n.action}
            />
          ))}

        <HorizontalDivider />
        <HTMLContent contentId={content.id} />
        <Features contentId={content.id} />
      </PaddedView>
    </>
  );
};

EventContentItem.propTypes = {
  content: PropTypes.shape({
    __typename: PropTypes.string,
    parentChannel: PropTypes.shape({
      name: PropTypes.string,
    }),
    id: PropTypes.string,
    htmlContent: PropTypes.string,
    title: PropTypes.string,
    scriptures: PropTypes.arrayOf(
      PropTypes.shape({
        /** The ID of the verse (i.e. '1CO.15.57') */
        id: PropTypes.string,
        /** A human readable reference (i.e. '1 Corinthians 15:57') */
        reference: PropTypes.string,
        /** The scripture source to render */
        html: PropTypes.string,
      })
    ),
    callsToAction: PropTypes.arrayOf(
      PropTypes.shape({
        call: PropTypes.string,
        action: PropTypes.string,
      })
    ),
    summary: PropTypes.string,
  }),
  loading: PropTypes.bool,
  ImageWrapperComponent: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
    PropTypes.object, // type check for React fragments
  ]),
};

export default EventContentItem;
