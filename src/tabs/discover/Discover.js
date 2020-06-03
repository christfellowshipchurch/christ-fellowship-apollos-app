import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { SafeAreaView } from 'react-navigation';
import { throttle } from 'lodash';

import { styled } from '@apollosproject/ui-kit';

import StatusBar from '../../ui/StatusBar';
import {
  navigationOptions,
  BackgroundView,
  NavigationSpacer,
} from '../../navigation';
import SearchInputHeader from '../../ui/SearchInputHeader';
import Browse from './Browse';
import SearchFeed from './SearchFeed';

const SearchInputHeaderContainer = styled(({ theme }) => ({
  flex: 1,
  paddingRight: theme.sizing.baseUnit * 0.75,
  marginLeft: -3,
}))(View);

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
  useEffect(() => setNavigationParam({ nested: isFocused }), [isFocused]);
  useEffect(
    () => setNavigationParam({ handleOnChangeText, handleOnFocus }),
    []
  );

  return (
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
  );
};

Discover.navigationOptions = (props) =>
  navigationOptions({
    ...props,
    title: 'Discover',
    headerTitle: (
      <SearchInputHeaderContainer>
        <SearchInputHeader
          onChangeText={props.navigation.getParam('handleOnChangeText')}
          onFocus={props.navigation.getParam('handleOnFocus')}
        />
      </SearchInputHeaderContainer>
    ),
  });

Discover.propTypes = {};

Discover.defaultProps = {};

export default Discover;
