import React from 'react';
import { Animated, View } from 'react-native';
import { useQuery } from '@apollo/client';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';

import { styled, BackgroundView, StretchyView } from '@apollosproject/ui-kit';
import { ApollosPlayerContainer } from '@apollosproject/ui-media-player';

import ScreenOrientation from 'screen-orientation';
import { FeaturesFeedConnected } from '../../features';
import GET_MEDIA from './getMedia';

const Noop = () => null;

const FlexedScrollView = styled({ flex: 1 })(Animated.ScrollView);

const FeatureContainer = styled(({ theme }) => ({
  paddingBottom: theme.sizing.baseUnit * 4,
}))(View);

const ItemSeparator = styled(({ theme }) => ({
  paddingTop: theme.sizing.baseUnit,
}))(View);

const PlayerContainerInner = ({
  nodeId,
  featuresFeedId,
  ImageWrapperComponent,
  children,
}) => (
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

    {!!featuresFeedId && (
      <FeatureContainer>
        <FeaturesFeedConnected
          featuresFeedId={featuresFeedId}
          ItemSeparatorComponent={ItemSeparator}
        />
      </FeatureContainer>
    )}
  </>
);

PlayerContainerInner.propTypes = {
  nodeId: PropTypes.string,
  featuresFeedId: PropTypes.string,
  ImageWrapperComponent: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
    PropTypes.object, // type check for React fragments
  ]),
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
};

const PlayerContainerConnected = ({ nodeId, featuresFeedId, children }) => (
  <BackgroundView>
    <StretchyView>
      {({ Stretchy, ...scrollViewProps }) => (
        <FlexedScrollView {...scrollViewProps}>
          <PlayerContainerInner
            nodeId={nodeId}
            featuresFeedId={featuresFeedId}
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
  featuresFeedId: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
};

const PlayerContainerConnectedWithMedia = ({
  nodeId,
  featuresFeedId,
  children,
  InnerComponent,
}) => {
  const { data } = useQuery(GET_MEDIA, {
    fetchPolicy: 'cache-and-network',
    variables: { nodeId },
    skip: isEmpty(nodeId),
  });

  const hasMedia =
    data?.node?.videos?.length &&
    data.node.videos.some(({ sources }) => sources.length);

  if (!hasMedia)
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
    >
      <ScreenOrientation />
      <InnerComponent
        nodeId={nodeId}
        featuresFeedId={featuresFeedId}
        ImageWrapperComponent={Noop}
      >
        {children}
      </InnerComponent>
    </ApollosPlayerContainer>
  );
};

PlayerContainerConnectedWithMedia.propTypes = {
  nodeId: PropTypes.string,
  featuresFeedId: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  InnerComponent: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
};

PlayerContainerConnectedWithMedia.defaultProps = {
  InnerComponent: PlayerContainerInner,
};

export default PlayerContainerConnectedWithMedia;
