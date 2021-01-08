import React from 'react';
import { View } from 'react-native';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import {
  styled,
  GradientOverlayImage,
  PaddedView,
} from '@apollosproject/ui-kit';
import Features from '../Features';
import Title from '../Title';
import HTMLContent from '../HTMLContent';
import ButtonWithLinkRouting from '../../ui/ButtonWithLinkRouting';
import { useLinkRouter } from '../../hooks';

const StyledButton = styled(({ theme }) => ({
  marginVertical: theme.sizing.baseUnit * 0.5,
}))(ButtonWithLinkRouting);

const ButtonContainer = styled(({ theme }) => ({
  marginVertical: theme.sizing.baseUnit * 0.5,
}))(View);

const InformationalContentItem = ({
  content,
  loading,
  ImageWrapperComponent,
}) => {
  const coverImageSources = get(content, 'coverImage.sources', []);
  const callsToAction = get(content, 'callsToAction', []);
  const redirectUrl = get(content, 'redirectUrl', '');
  const { routeLink } = useLinkRouter();

  if (redirectUrl && redirectUrl !== '') {
    routeLink(redirectUrl);
  }

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
        {callsToAction.length > 0 && (
          <ButtonContainer>
            {callsToAction.map((n) => (
              <StyledButton
                key={`${n.call}:${n.action}`}
                title={n.call}
                pill={false}
                url={n.action}
              />
            ))}
          </ButtonContainer>
        )}
        <HTMLContent contentId={content.id} />
        <Features contentId={content.id} />
      </PaddedView>
    </>
  );
};

InformationalContentItem.propTypes = {
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

export default InformationalContentItem;
