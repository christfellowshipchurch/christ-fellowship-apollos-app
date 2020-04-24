import React, { useState } from 'react';
import { Animated } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { useQuery } from '@apollo/react-hooks';
import { get } from 'lodash';
import PropTypes from 'prop-types';

import {
  BackgroundView,
  FeedView,
  FlexedView,
  H3,
  styled,
  withTheme,
  Touchable,
} from '@apollosproject/ui-kit';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import ActionRow from '../ui/ActionRow';
import ContentCardConnected from '../ui/ContentCardConnected';
import {
  navigationOptions,
  NavigationSpacer,
  useHeaderScrollEffect,
} from '../navigation';

import GET_CONTENT_FEED from './getContentFeed';

const HeaderTitle = styled(() => ({
  flex: 4,
  textAlign: 'center',
}))(H3);

const HeaderIconContainer = styled(() => ({
  flex: 1,
}))(Touchable);

const HeaderContainer = styled(({ theme }) => ({
  paddingTop: theme.sizing.baseUnit * 4,
  paddingHorizontal: theme.sizing.baseUnit,
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'row',
}))(FlexedView);

const BackIcon = withTheme(({ theme }) => ({
  color: theme.colors.darkSecondary,
  icon: ['fal', 'angle-left'],
  size: 42,
  style: {
    flex: 1,
    justifyContent: 'flex-start',
  },
}))(FontAwesomeIcon);

export const RowFeedHeaderComponent = ({
  navigation,
  title,
  navigationKey,
}) => (
    <HeaderContainer>
      <HeaderIconContainer onPress={() => navigation.goBack(navigationKey)}>
        <BackIcon />
      </HeaderIconContainer>

      <HeaderTitle>{title}</HeaderTitle>

      <HeaderIconContainer>
        {/* 3 flex containers to help with even spacing */}
      </HeaderIconContainer>
    </HeaderContainer>
  );

RowFeedHeaderComponent.defaultProps = {
  title: '',
  navigationKey: null,
};

RowFeedHeaderComponent.propTypes = {
  title: PropTypes.string,
  navigationKey: PropTypes.string,
};

const mapData = (data) =>
  get(data, 'node.childContentItemsConnection.edges', []).map(({ node }) => ({
    ...node,
    coverImage: get(node, 'coverImage.sources', []),
    label: get(node, 'tags[0]'),
  }));

/**
 * This is where the component description lives
 * A FeedView wrapped in a query to pull content data.
 */
const ContentFeed = ({ navigation, Component, card }) => {
  const itemId = navigation.getParam('itemId', []);
  const { loading, error, data, refetch } = useQuery(GET_CONTENT_FEED, {
    fetchPolicy: 'cache-and-network',
    variables: {
      itemId,
    },
  });
  const { scrollY } = useHeaderScrollEffect({ navigation });
  /** Function that is called when a card in the feed is pressed.
   * Takes the user to the ContentSingle
   */
  const handleOnPress = (item) => {
    navigation.navigate('ContentSingle', {
      itemId: item.id,
      sharing: item.sharing,
    });
  };

  const ContentCard = (props) => (
    <ContentCardConnected card={card} {...props} />
  );

  return (
    <BackgroundView>
      <SafeAreaView>
        <FeedView
          ListItemComponent={Component || ContentCard}
          content={mapData(data)}
          isLoading={loading}
          error={error}
          onPressItem={handleOnPress}
          ListHeaderComponent={<NavigationSpacer />}
          scrollEventThrottle={16}
          onScroll={Animated.event([
            {
              nativeEvent: {
                contentOffset: { y: scrollY },
              },
            },
          ])}
        />
      </SafeAreaView>
    </BackgroundView>
  );
};

ContentFeed.navigationOptions = ({ navigation, ...props }) =>
  navigationOptions({
    navigation,
    ...props,
    title: navigation.getParam('itemTitle', 'Content Channel'),
  });

ContentFeed.propTypes = {
  /** Functions passed down from React Navigation to use in navigating to/from
   * items in the feed.
   */
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
    navigate: PropTypes.func,
  }),
  Component: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
  card: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
};

ContentFeed.defaultProps = {
  Component: null,
  card: ActionRow,
};

export default ContentFeed;
