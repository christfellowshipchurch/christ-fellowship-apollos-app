import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { storiesOf } from '@apollosproject/ui-storybook';
import { BackgroundView } from '@apollosproject/ui-kit';
import mockData from './SearchFeedDataMock';
import { SearchFeed } from '.';

const mockNavigation = {
  navigate: () => null,
  getParam: () => null,
  setParams: () => null,
};

storiesOf('cf-ui/Search', module).add('with valid results', () => (
  <BackgroundView>
    <SafeAreaView>
      <SearchFeed navigation={mockNavigation} content={mockData} />
    </SafeAreaView>
  </BackgroundView>
));

storiesOf('cf-ui/Search', module).add('no user input', () => (
  <BackgroundView>
    <SafeAreaView style={{ flex: 1 }}>
      <SearchFeed navigation={mockNavigation} searchText="" content={[]} />
    </SafeAreaView>
  </BackgroundView>
));

storiesOf('cf-ui/Search', module).add('no results', () => (
  <BackgroundView>
    <SafeAreaView style={{ flex: 1 }}>
      <SearchFeed
        navigation={mockNavigation}
        searchText="Some Random Search"
        content={[]}
      />
    </SafeAreaView>
  </BackgroundView>
));

storiesOf('cf-ui/Search', module).add('isLoading', () => (
  <BackgroundView>
    <SafeAreaView>
      <SearchFeed navigation={mockNavigation} isLoading filters={[]} />
    </SafeAreaView>
  </BackgroundView>
));

storiesOf('cf-ui/Search', module).add('error', () => (
  <BackgroundView>
    <SafeAreaView style={{ flex: 1 }}>
      <SearchFeed
        navigation={mockNavigation}
        error={'Oops! Something went wrong'}
      />
    </SafeAreaView>
  </BackgroundView>
));
