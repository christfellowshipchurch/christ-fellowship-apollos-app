import React from 'react';
import { Platform, View } from 'react-native';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { get } from 'lodash';
import Share from 'ChristFellowship/src/ui/Share';

import { SideBySideView, styled } from '@apollosproject/ui-kit';
import LikeButton from 'ChristFellowship/src/ui/LikeButton';
import { MediaPlayerSpacer } from '@apollosproject/ui-media-player';

import GET_SHARE_CONTENT from './getShareContent';

const PositioningView = styled(({ theme }) => ({
  justifyContent: 'space-around',
  paddingVertical: theme.sizing.baseUnit / 2,
  paddingHorizontal: theme.sizing.baseUnit,
}))(SideBySideView);

const Container = styled(({ theme }) => ({
  backgroundColor: theme.colors.paper,
  ...Platform.select(theme.shadows.default),
}))(View);

const ActionContainer = ({ itemId }) => (
  <Container>
    <MediaPlayerSpacer>
      <PositioningView>
        <LikeButton itemId={itemId} />
        <Query query={GET_SHARE_CONTENT} variables={{ itemId }}>
          {({ data: { node } = {}, error, loading }) => {
            const sharing = get(node, 'sharing');
            return loading || error || !sharing ? null : (
              <Share content={sharing} />
            );
          }}
        </Query>
      </PositioningView>
    </MediaPlayerSpacer>
  </Container>
);

ActionContainer.propTypes = {
  content: PropTypes.shape({}),
  itemId: PropTypes.string,
};

export default ActionContainer;
