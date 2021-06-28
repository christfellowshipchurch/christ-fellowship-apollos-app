import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useApolloClient, useQuery } from '@apollo/client';
import { get, isEmpty } from 'lodash';

import { AppState, FlatList, View } from 'react-native';
import {
  ActivityIndicator,
  UIText,
  Touchable,
  styled,
  withTheme,
  ThemeMixin,
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
  isLoading: parentLoading,
  error: parentError,
  ListEmptyComponent,
  ...props
}) => {
  // :: State
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const [features, setFeatures] = useState([]);
  const [isLoading, setIsLoading] = useState(parentLoading);

  // :: Network Requests
  const QUERY_PARAMS = {
    fetchPolicy: 'network-only',
    variables: {
      id: featuresFeedId,
    },
  };
  const client = useApolloClient();
  const refetch = async () => {
    setIsLoading(true);

    const { data } = await client.query({
      query: GET_FEATURES_FEED,
      ...QUERY_PARAMS,
      partialRefetch: true,
    });

    setFeatures(data?.node?.features || []);
    setIsLoading(false);
  };
  const { loading, error } = useQuery(GET_FEATURES_FEED, {
    ...QUERY_PARAMS,
    skip: isEmpty(featuresFeedId),
    onCompleted: (data) => {
      setFeatures(data?.node?.features || []);
    },
  });

  const errorInStack = !!parentError || !!error;
  const dataInStack = !!features && features.length;

  const _handleAppStateChange = (nextAppState) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active' &&
      !isLoading &&
      typeof refetch === 'function'
    ) {
      refetch();
    }

    appState.current = nextAppState;
    setAppStateVisible(appState.current);
  };

  useEffect(
    () => {
      setIsLoading(parentLoading || loading);
    },
    [parentLoading, loading]
  );

  useEffect(() => {
    AppState.addEventListener('change', _handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', _handleAppStateChange);
    };
  }, []);

  if (!features.length && (loading || isLoading) && !error) {
    return <ActivityIndicator />;
  }

  return (
    <ThemeMixin>
      <FlatList
        data={features}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparatorComponent}
        ListEmptyComponent={
          errorInStack && !isLoading && !dataInStack
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
          if (!isLoading) {
            refetch();
          }
        }}
        refreshing={isLoading}
        numColumns={1}
        {...props}
      />
    </ThemeMixin>
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
  ItemSeparatorComponent: HorizontalDivider,
  ListEmptyComponent: () => null,
};

export default ({ featuresFeedId, ...props }) =>
  isEmpty(featuresFeedId) ? (
    <ActivityIndicator />
  ) : (
    <FeaturesFeedConnected {...props} featuresFeedId={featuresFeedId} />
  );
