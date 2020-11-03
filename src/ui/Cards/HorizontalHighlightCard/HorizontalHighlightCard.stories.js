import React from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import { BackgroundView } from '@apollosproject/ui-kit';
import { storiesOf } from '@apollosproject/ui-storybook';
import { CardFeed } from '../../CardFeeds';
import mockData from './HorizontalHighlightCardMockData';
import HorizontalHightlightCard from '.';

console.log({ mockData });

const loadingStateObject = {
  id: 'fakeId0',
  isLoading: true,
  title: 'Boom',
  coverImage: [],
  // We need to assume a typename so horizontalContentCardComponentMapper knows what "type" to render
  __typename: 'Group',
};

const mockNavigation = {
  navigate: () => null,
};

storiesOf('cf-ui/HorizontalHightlightCard', module).add('default', () => (
  <BackgroundView>
    <SafeAreaView>
      <CardFeed
        content={mockData}
        navigation={mockNavigation}
        loadingStateObject={loadingStateObject}
        horizontal
        renderItem={({ item }) => <HorizontalHightlightCard {...item} />}
      />
    </SafeAreaView>
  </BackgroundView>
));

storiesOf('cf-ui/HorizontalHightlightCard', module).add('Theme Small', () => (
  <BackgroundView>
    <SafeAreaView>
      <CardFeed
        content={mockData}
        navigation={mockNavigation}
        horizontal
        renderItem={({ item }) => (
          <HorizontalHightlightCard {...item} size="small" />
        )}
        loadingStateObject={loadingStateObject}
      />
    </SafeAreaView>
  </BackgroundView>
));

storiesOf('cf-ui/HorizontalHightlightCard', module).add('Theme Medium', () => (
  <BackgroundView>
    <SafeAreaView>
      <CardFeed
        content={mockData}
        navigation={mockNavigation}
        horizontal
        renderItem={({ item }) => (
          <HorizontalHightlightCard {...item} size="medium" />
        )}
        loadingStateObject={loadingStateObject}
      />
    </SafeAreaView>
  </BackgroundView>
));
