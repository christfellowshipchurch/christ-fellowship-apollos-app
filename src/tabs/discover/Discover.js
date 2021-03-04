import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { get, throttle } from 'lodash';

import { BackgroundView } from '@apollosproject/ui-kit';
import DynamicThemeMixin from 'ui/DynamicThemeMixin';
import StatusBar from 'ui/StatusBar';
import SearchInputHeader from './SearchInputHeader';
import Browse from './Browse';
import SearchFeed from './SearchFeed';

const Discover = ({ navigation }) => {
  const [isFocused, setIsFocused] = useState(
    get(navigation, 'params.showSearch', false)
  );
  const [searchText, setSearchText] = useState(
    get(navigation, 'params.searchText', '')
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
        <SafeAreaView style={{ flex: 1 }}>
          <StatusBar />
          <SearchInputHeader
            onChangeText={throttle(setSearchText, 300)}
            onFocus={setIsFocused}
          />
          {isFocused ? (
            <SearchFeed searchText={searchText} navigation={navigation} />
          ) : (
            <Browse
              navigation={navigation}
              selectedFilter={get('navigation', 'params.selectedFilter', '')}
            />
          )}
        </SafeAreaView>
      </BackgroundView>
    </DynamicThemeMixin>
  );
};

Discover.propTypes = {};

Discover.defaultProps = {};

export default Discover;
