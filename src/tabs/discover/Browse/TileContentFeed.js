import React from 'react';
import { View } from 'react-native';
import { withNavigation } from 'react-navigation';
import { useQuery } from '@apollo/react-hooks';
import PropTypes from 'prop-types';
import { get, take } from 'lodash';

import {
  styled,
  withTheme,
  H4,
  H6,
  HorizontalTileFeed,
  ButtonLink,
  TouchableScale,
  Touchable,
  HorizontalDefaultCard,
} from '@apollosproject/ui-kit';

import ContentCardConnected from '../../../ui/ContentCardConnected';
import { GET_CATEGORY_PREVIEW } from './queries';

const RowHeader = styled(({ theme }) => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'flex-end',
  zIndex: 2, // UX hack to improve tapability. Positions RowHeader above StyledHorizontalTileFeed
  // paddingTop: theme.sizing.baseUnit * 2,
  paddingLeft: theme.sizing.baseUnit,
}))(View);

const Name = styled(({ theme }) => ({
  width: '75%',
  flexGrow: 2,
  paddingBottom: theme.sizing.baseUnit, // should match the ButtonLinkSpacing in case that element doesn't show
}))(View);

const AndroidTouchableFix = withTheme(({ theme }) => ({
  width: '25%',
  borderRadius: theme.sizing.baseUnit / 2,
}))(Touchable);

const ButtonLinkSpacing = styled(({ theme }) => ({
  color: theme.colors.primary,
  flexDirection: 'row', // correctly positions the loading state
  justifyContent: 'flex-end', // correctly positions the loading state
  padding: theme.sizing.baseUnit, // UX hack to improve tapability.
}))(View);

const StyledHorizontalTileFeed = styled(({ theme }) => ({
  /* UX hack to improve tapability. The magic number below happens to be the number of pixels that
   * aligns everything in the same place as if none of the UX hacks were there. */
  marginTop: theme.sizing.baseUnit * -1.25,
  zIndex: 1,
}))(HorizontalTileFeed);

const Container = styled(({ theme }) => ({
  marginBottom: theme.sizing.baseUnit,
}))(View);

const loadingStateObject = {
  id: 'fake_id',
  title: '',
  coverImage: [],
};

const mapData = (data, additionalProps) =>
  get(data, 'node.childContentItemsConnection.edges', []).map((edges) => ({
    ...edges.node,
    ...additionalProps,
  }));

const renderItem = ({ item }) => (
  <TouchableScale onPress={() => item.onPress(item)}>
    <ContentCardConnected
      card={HorizontalDefaultCard}
      contentId={item.id}
      isLoading={item.isLoading && (!item.id || item.id === '')}
      inHorizontalList
    />
  </TouchableScale>
);

const TileContentFeed = ({ id, navigation, isLoading: parentIsLoading }) => {
  const { loading, error, data } = useQuery(GET_CATEGORY_PREVIEW, {
    variables: { id },
    fetchPolicy: 'cache-and-network',
    skip: !id || id === '' || parentIsLoading,
  });

  const title = get(data, 'node.title', '');
  const content = mapData(data, {
    onPress: (item) =>
      navigation.push('ContentSingle', {
        itemId: item.id,
      }),
  });
  const inLoadingState = (loading || parentIsLoading) && !content.length;
  const onPressSeeMore = () => {
    navigation.navigate('ContentFeed', {
      itemId: id,
      itemTitle: title,
      nested: true,
    });
  };

  return content.length ? (
    <Container>
      <RowHeader>
        <Name>
          <H4 isLoading={inLoadingState}>{title}</H4>
        </Name>
        {content.length > 3 &&
          !inLoadingState && (
            <AndroidTouchableFix onPress={onPressSeeMore}>
              <ButtonLinkSpacing>
                <H6>
                  <ButtonLink>See More</ButtonLink>
                </H6>
              </ButtonLinkSpacing>
            </AndroidTouchableFix>
          )}
      </RowHeader>
      <StyledHorizontalTileFeed
        content={take(content, 3)}
        renderItem={renderItem}
        loadingStateObject={loadingStateObject}
        isLoading={inLoadingState}
      />
    </Container>
  ) : null;
};

TileContentFeed.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
  id: PropTypes.string,
  isLoading: PropTypes.bool,
};

TileContentFeed.defaultProps = {
  isLoading: false,
};

export default withNavigation(TileContentFeed);
