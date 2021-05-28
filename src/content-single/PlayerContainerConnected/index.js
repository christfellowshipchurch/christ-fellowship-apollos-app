import React from 'react';
import { Animated, View } from 'react-native';
import { useQuery } from '@apollo/client';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  styled,
  BackgroundView,
  FlexedView,
  StretchyView,
} from '@apollosproject/ui-kit';
import { ApollosPlayerContainer } from '@apollosproject/ui-media-player';

import ScreenOrientation from 'screen-orientation';
import GET_MEDIA from './getMedia';

const Noop = () => null;

const ContentSpacing = styled(({ topInset = null }) => ({
  transform: [{ translateY: topInset || 0 }],
  flex: 1,
}))(View);

const BlackBars = styled(({ theme, topInset = null }) => ({
  backgroundColor: theme.colors.black,
  height: topInset || 0,
}))(View);

const FlexedScrollView = styled({ flex: 1 })(Animated.ScrollView);

const PlayerContainerInner = ({ nodeId, ImageWrapperComponent, children }) =>
  React.Children.map(children, (child) => {
    // checking isValidElement is the safe way and avoids a typescript error too
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        nodeId,
        ImageWrapperComponent,
      });
    }
    return child;
  });

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
  featuresFeedId: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
};

const PlayerContainerConnectedWithMedia = ({
  nodeId,
  children,
  InnerComponent,
}) => {
  const insets = useSafeAreaInsets();
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
    <FlexedView>
      <BlackBars topInset={insets.top} />
      <ContentSpacing>
        <ApollosPlayerContainer
          source={data.node?.videos[0]?.sources[0]}
          coverImage={data.node?.coverImage?.sources}
          presentationProps={{
            title: data.node.title,
          }}
        >
          <ScreenOrientation />
          <BackgroundView>
            <InnerComponent nodeId={nodeId} ImageWrapperComponent={Noop}>
              {children}
            </InnerComponent>
          </BackgroundView>
        </ApollosPlayerContainer>
      </ContentSpacing>
    </FlexedView>
  );
};

PlayerContainerConnectedWithMedia.propTypes = {
  nodeId: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  InnerComponent: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
};

PlayerContainerConnectedWithMedia.defaultProps = {
  InnerComponent: PlayerContainerInner,
};

export default PlayerContainerConnectedWithMedia;
