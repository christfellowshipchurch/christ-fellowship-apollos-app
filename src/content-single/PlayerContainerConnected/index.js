import React from 'react';
import { Animated } from 'react-native';
import { useQuery } from '@apollo/client';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';

import {
  ContentChildFeedConnected,
  ContentParentFeedConnected,
} from '@apollosproject/ui-connected';
import { styled, BackgroundView, StretchyView } from '@apollosproject/ui-kit';
import { ApollosPlayerContainer } from '@apollosproject/ui-media-player';

import ScreenOrientation from 'screen-orientation';
import GET_MEDIA from './getMedia';

const Noop = () => null;

const FlexedScrollView = styled({ flex: 1 })(Animated.ScrollView);

const PlayerContainerInner = ({ nodeId, ImageWrapperComponent, children }) => (
  <>
    {React.Children.map(children, (child) => {
      // checking isValidElement is the safe way and avoids a typescript error too
      if (React.isValidElement(child)) {
        return React.cloneElement(child, {
          nodeId,
          ImageWrapperComponent,
        });
      }
      return child;
    })}
    <ContentParentFeedConnected nodeId={nodeId} />
    <ContentChildFeedConnected nodeId={nodeId} />
  </>
);

PlayerContainerInner.propTypes = {
  nodeId: PropTypes.string,
  ImageWrapperComponent: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
    PropTypes.object, // type check for React fragments
  ]),
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
};

const PlayerContainerConnected = ({ nodeId, children }) => (
  <BackgroundView>
    <StretchyView>
      {({ Stretchy, ...scrollViewProps }) => (
        <FlexedScrollView {...scrollViewProps}>
          <PlayerContainerInner
            nodeId={nodeId}
            ImageWrapperComponent={Stretchy}
          >
            {children}
          </PlayerContainerInner>
        </FlexedScrollView>
      )}
    </StretchyView>
  </BackgroundView>
);

PlayerContainerConnected.propTypes = {
  nodeId: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
};

const PlayerContainerConnectedWithMedia = ({ nodeId, children }) => {
  const { data } = useQuery(GET_MEDIA, {
    fetchPolicy: 'cache-and-network',
    variables: { nodeId },
    skip: isEmpty(nodeId),
  });

  if (!data?.node?.videos?.length)
    return (
      <PlayerContainerConnected nodeId={nodeId}>
        {children}
      </PlayerContainerConnected>
    );

  return (
    <ApollosPlayerContainer
      source={data.node?.videos[0]?.sources[0]}
      coverImage={data.node?.coverImage?.sources}
      presentationProps={{
        title: data.node.title,
      }}
      collapseOnScroll
    >
      <ScreenOrientation />
      <PlayerContainerInner nodeId={nodeId} ImageWrapperComponent={Noop}>
        {children}
      </PlayerContainerInner>
    </ApollosPlayerContainer>
  );
};

PlayerContainerConnectedWithMedia.propTypes = {
  nodeId: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
};

export default PlayerContainerConnectedWithMedia;
