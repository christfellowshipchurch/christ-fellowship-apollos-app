import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { storiesOf } from '@apollosproject/ui-storybook';
import { BackgroundView, UIText, PaddedView } from '@apollosproject/ui-kit';
import BrowseConnected, { Browse } from './Browse';

const mockNavigation = {
  navigate: () => null,
  getParam: () => null,
  setParams: () => null,
};

storiesOf('cf-ui/Browse', module).add('default', () => (
  <BackgroundView>
    <SafeAreaView>
      <BrowseConnected navigation={mockNavigation} />
    </SafeAreaView>
  </BackgroundView>
));

storiesOf('cf-ui/Browse', module).add('pre-selected filter', () => (
  <BackgroundView>
    <SafeAreaView>
      <PaddedView>
        <UIText bold>Articles is pre-selected as the filter option</UIText>
      </PaddedView>
      <BrowseConnected navigation={mockNavigation} selectedFilter="Articles" />
    </SafeAreaView>
  </BackgroundView>
));

storiesOf('cf-ui/Browse', module).add('invalid pre-selected filter', () => (
  <BackgroundView>
    <SafeAreaView>
      <PaddedView>
        <UIText bold>
          Since we are telling it to use "Star Wars" as the pre-selected filter
          and there is no "Star Wars" filter, it defaults to the first available
          filter.
        </UIText>
      </PaddedView>
      <BrowseConnected navigation={mockNavigation} selectedFilter="Star Wars" />
    </SafeAreaView>
  </BackgroundView>
));

/** To test loading state, we don't want to fetch real data, so
 * we just reference the visual item directly
 */
storiesOf('cf-ui/Browse', module).add('isLoading', () => (
  <BackgroundView>
    <SafeAreaView>
      <Browse navigation={mockNavigation} isLoading filters={[]} />
    </SafeAreaView>
  </BackgroundView>
));

/** To test error state, we don't want to fetch real data, so
 * we just reference the visual item directly
 */
storiesOf('cf-ui/Browse', module).add('error', () => (
  <BackgroundView>
    <SafeAreaView>
      <Browse
        navigation={mockNavigation}
        error={'Oops! Something went wrong'}
      />
    </SafeAreaView>
  </BackgroundView>
));
