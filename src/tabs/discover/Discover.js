import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { SafeAreaView } from 'react-navigation';
import { throttle } from 'lodash';

import { styled, FlexedView, BackgroundView } from '@apollosproject/ui-kit';

import StatusBar from '../../ui/StatusBar';
import { navigationOptions, NavigationSpacer } from '../../navigation';
import DynamicThemeMixin from '../../ui/DynamicThemeMixin';
import SearchInputHeader from './SearchInputHeader';
import Browse from './Browse';
import SearchFeed from './SearchFeed';

const Discover = ({ navigation }) => {
  const [isFocused, setIsFocused] = useState(
    navigation.getParam('searchFocused')
  );
  const [searchText, setSearchText] = useState(
    navigation.getParam('searchText')
  );

  const setNavigationParam = (params) => {
    navigation.setParams(params);
  };

  const handleOnChangeText = throttle((value) => setSearchText(value), 300);

  const handleOnFocus = (inputState) => {
    setIsFocused(inputState);
  };

  // The 'nested' parameter is already set to show/hide the menu
  // icon, so we're using that so we don't have to manually import
  // the icon and handle that explicitly
  useEffect(() => setNavigationParam({ isFocused }), [isFocused]);
  useEffect(
    () => setNavigationParam({ handleOnChangeText, handleOnFocus }),
    []
  );

  return (
    <DynamicThemeMixin>
      <BackgroundView>
        <SafeAreaView>
          <NavigationSpacer />
          <StatusBar />
          {isFocused ? (
            <SearchFeed searchText={searchText} />
          ) : (
              <Browse navigation={navigation} />
            )}
        </SafeAreaView>
      </BackgroundView>
    </DynamicThemeMixin>
  );
};

Discover.navigationOptions = (props) =>
  navigationOptions({
    ...props,
    title: 'Discover',
    headerTitle: (
      <SearchInputHeader
        onChangeText={props.navigation.getParam('handleOnChangeText')}
        onFocus={props.navigation.getParam('handleOnFocus')}
      />
    ),
    headerRight: null,
  });

Discover.propTypes = {};

Discover.defaultProps = {};

export default Discover;
