import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useLazyQuery } from '@apollo/client';
import { get, isEmpty } from 'lodash';

import { FlatList, View } from 'react-native';
import {
  ActivityIndicator,
  UIText,
  Touchable,
  styled,
  withTheme,
} from '@apollosproject/ui-kit';

import { HorizontalDivider } from 'ui/Dividers';
import { FeatureConnected } from '../FeatureConnected';

import GET_FEATURES_FEED from './getFeaturesFeed';

// :: Styled Componenents
// :: ====================== ::
const ErrorContainer = styled(({ theme }) => ({
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.sizing.baseUnit * 2,
}))(View);

const ErrorText = withTheme(({ theme }) => ({
  italic: true,
  style: {
    textAlign: 'center',
    color: theme.colors.text.tertiary,
  },
}))(UIText);

const ErrorTouchableText = withTheme(({ theme }) => ({
  bold: true,
  style: {
    color: theme.colors.primary,
    padding: theme.sizing.baseUnit,
  },
}))(UIText);

// :: Feature Feed Component
// :: ====================== ::
const renderItem = ({ item }) => <FeatureConnected key={item?.id} {...item} />;

const FeaturesFeedConnected = ({
  featuresFeedId,
  ItemSeparatorComponent,
  isLoading,
  error: parentError,
  ListEmptyComponent,
  ...props
}) => {
  /**
   * note : because of a bug with the `skip` parameter in the `useQuery` hook, we'll use the `useLazyQuery` api instead so we can mimic that behavior manually
   */
  const [
    getFeaturesFeed,
    { data, loading, error, called, refetch },
  ] = useLazyQuery(GET_FEATURES_FEED);
  const features = data?.node?.features || [];
  const errorInStack = !!parentError || !!error;
  const loadingInStack = loading || isLoading;
  const dataInStack = !!features && features.length;

  useEffect(
    () => {
      /**
       * note : it's really easy for this query to get away from us if we call it too many times, so we're just being suuuuuuper picky with this condition so that we only ever call this on the first load (all subsequent loads should comes from pull-to-refetch)
       */

      if (!loading && featuresFeedId && !isEmpty(featuresFeedId) && !called) {
        getFeaturesFeed({
          fetchPolicy: 'cache-and-network',
          variables: {
            id: featuresFeedId,
          },
        });
      }
    },
    [featuresFeedId]
  );

  if (!features.length && !error) {
    return <ActivityIndicator />;
  }

  return (
    <FlatList
      data={features}
      renderItem={renderItem}
      ItemSeparatorComponent={ItemSeparatorComponent}
      ListEmptyComponent={
        errorInStack && !loadingInStack && !dataInStack
          ? console.warn(error) || (
              <ErrorContainer>
                <ErrorText>
                  {`Oops! Something went wrong and we weren't able to load up that data`}
                </ErrorText>
                <Touchable onPress={() => refetch()}>
                  <ErrorTouchableText>{'Try Again'}</ErrorTouchableText>
                </Touchable>
              </ErrorContainer>
            )
          : ListEmptyComponent
      }
      removeClippedSubviews
      keyExtractor={(item, index) => get(item, 'id', index)}
      onRefresh={() => {
        if (!loadingInStack) {
          refetch();
        }
      }}
      refreshing={isLoading}
      numColumns={1}
      {...props}
    />
  );
};

FeaturesFeedConnected.propTypes = {
  featuresFeedId: PropTypes.string,
  additionalFeatures: PropTypes.shape({}),
  error: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
    PropTypes.object,
  ]),
  features: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
    })
  ),
  isLoading: PropTypes.bool,
  ItemSeparatorComponent: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.object,
  ]),
  ListEmptyComponent: PropTypes.any, // eslint-disable-line
};

FeaturesFeedConnected.defaultProps = {
  additionalFeatures: {},
  error: null,
  features: [],
  isLoading: false,
  refetch: () => null,
  ItemSeparatorComponent: HorizontalDivider,
  ListEmptyComponent: () => null,
};

export default FeaturesFeedConnected;
