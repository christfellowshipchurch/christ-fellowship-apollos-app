import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { AppState, FlatList, View } from 'react-native';
import {
  ActivityIndicator,
  UIText,
  Touchable,
  styled,
  withTheme,
} from '@apollosproject/ui-kit';

import { HorizontalDivider } from 'ui/Dividers';
import { FeatureConnected } from '../FeatureConnected';

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

// :: Feature Provider
// :: ====================== ::
const FeaturesFeedContext = React.createContext([]);

export const useFeaturesFeed = () => useContext(FeaturesFeedContext);

// :: Feature Feed Component
// :: ====================== ::
const renderItem = ({ item }) => <FeatureConnected key={item?.id} {...item} />;

const FeaturesFeedConnected = ({
  ItemSeparatorComponent,
  features,
  previousFeatures,
  refetch,
  isLoading,
  error,
  ListEmptyComponent,
  ...props
}) => {
  const [refetchStatus, setRefetchStatus] = useState(0);

  /**
   * note : along with pull-to-refresh, we will also listen to App State changes and run `refetch` when our app comes back into 'active' state
   */
  const _handleAppStateChange = (nextAppState) => {
    if (nextAppState === 'active' && !isLoading) {
      refetch();
    }
  };

  useEffect(() => {
    AppState.addEventListener('change', _handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', _handleAppStateChange);
    };
  }, []);

  useEffect(
    () => {
      if (!isLoading) {
        if (
          features &&
          JSON.stringify(features) === JSON.stringify(previousFeatures)
        ) {
          setRefetchStatus(2); // refetch feature
        }
      } else {
        setRefetchStatus(1); // parent loading
      }
    },
    [features, previousFeatures, isLoading]
  );

  if (!features.length && !error) {
    return <ActivityIndicator />;
  }

  return (
    <FlatList
      extraData={{ isLoading }}
      data={features.map((feature) => ({
        ...feature,
        isLoading,
        refetchStatus,
      }))}
      renderItem={renderItem}
      ItemSeparatorComponent={ItemSeparatorComponent}
      ListEmptyComponent={
        error && !isLoading && (!features || !features.length)
          ? console.warn(error) || (
              <ErrorContainer>
                <ErrorText>
                  {`Oops! Something went wrong and we weren't able to load up that data`}
                </ErrorText>
                <Touchable onPress={refetch}>
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
  );
};

FeaturesFeedConnected.propTypes = {
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
  refetch: PropTypes.func,
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
