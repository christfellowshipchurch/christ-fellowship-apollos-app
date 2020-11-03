import React from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import { BackgroundView } from '@apollosproject/ui-kit';
import { storiesOf } from '@apollosproject/ui-storybook';
import { CardFeed } from '../../CardFeeds';
import mockData from './HorizontalDefaultCardMockData';
import HorizontalHightlightCard from '.';

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
      <ScrollView>
        <CardFeed
          content={mockData}
          navigation={mockNavigation}
          card={HorizontalHightlightCard}
          loadingStateObject={loadingStateObject}
          horizontal
        />
      </ScrollView>
    </SafeAreaView>
  </BackgroundView>
));

storiesOf('cf-ui/HorizontalHightlightCard', module).add('Theme Small', () => (
  <BackgroundView>
    <SafeAreaView>
      <ScrollView>
        <CardFeed
          content={mockData}
          navigation={mockNavigation}
          horizontal
          card={HorizontalHightlightCard}
          loadingStateObject={loadingStateObject}
        />
      </ScrollView>
    </SafeAreaView>
  </BackgroundView>
));
