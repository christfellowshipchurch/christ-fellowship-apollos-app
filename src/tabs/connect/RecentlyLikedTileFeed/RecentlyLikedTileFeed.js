import React, { Component } from 'react';
import { View } from 'react-native';
import { withNavigation } from 'react-navigation';
import PropTypes from 'prop-types';

import {
  styled,
  withTheme,
  PaddedView,
  H5,
  H6,
  HorizontalTileFeed,
  ButtonLink,
  TouchableScale,
  Touchable,
  withIsLoading,
} from '@apollosproject/ui-kit';

import ContentCard from 'ChristFellowship/src/ui/ContentCardConnected';

const RowHeader = styled(({ theme }) => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  zIndex: 2, // UX hack to improve tapability. Positions RowHeader above StyledHorizontalTileFeed
  paddingTop: theme.sizing.baseUnit * 0.5,
  paddingLeft: theme.sizing.baseUnit,
}))(View);

const Name = styled({
  flexGrow: 2,
})(View);

const ButtonLinkSpacing = styled(({ theme }) => ({
  flexDirection: 'row', // correctly positions the loading state
  justifyContent: 'flex-end', // correctly positions the loading state
  padding: theme.sizing.baseUnit, // UX hack to improve tapability.
}))(View);

const AndroidTouchableFix = withTheme(({ theme }) => ({
  borderRadius: theme.sizing.baseBorderRadius / 2,
}))(Touchable);

const StyledHorizontalTileFeed = styled(({ theme }) => ({
  /* UX hack to improve tapability. The magic number below happens to be the number of pixels that
   * aligns everything in the same place as if none of the UX hacks were there. */
  marginTop: theme.sizing.baseUnit * -1.25,
  zIndex: 1,
}))(HorizontalTileFeed);

class RecentlyLikedTileFeed extends Component {
  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func,
    }),
    isLoading: PropTypes.bool,
    name: PropTypes.string,
    content: PropTypes.arrayOf(
      PropTypes.any // this component doesn't care about the shape of `node`, just that it exists
    ),
  };

  loadingStateObject = {
    id: 'fake_id',
    title: '',
    coverImage: [],
  };

  titleImageItem = ({ item }) => (
    <TouchableScale
      onPress={() => {
        this.props.navigation.push('ContentSingle', {
          itemId: item.id,
        });
      }}
    >
      <ContentCard
        isLoading={item.isLoading}
        tile
        contentId={item.id}
        inHorizontalList
      />
    </TouchableScale>
  );

  render() {
    const { isLoading, name, navigation, content = [] } = this.props;

    return (
      <PaddedView horizontal={false}>
        <RowHeader>
          <Name>
            <H5>{name}</H5>
          </Name>

          <AndroidTouchableFix
            onPress={() => {
              navigation.navigate('LikedContentList');
            }}
          >
            <ButtonLinkSpacing>
              <H6>
                {/* we have to wrap "View All" in a ButtonLink twice to inherit styles and color correctly. */}
                <ButtonLink>View All</ButtonLink>
              </H6>
            </ButtonLinkSpacing>
          </AndroidTouchableFix>
        </RowHeader>
        <StyledHorizontalTileFeed
          initialNumToRender={5}
          content={content}
          renderItem={this.titleImageItem}
          loadingStateObject={this.loadingStateObject}
          isLoading={isLoading}
        />
      </PaddedView>
    );
  }
}

export default withNavigation(withIsLoading(RecentlyLikedTileFeed));
