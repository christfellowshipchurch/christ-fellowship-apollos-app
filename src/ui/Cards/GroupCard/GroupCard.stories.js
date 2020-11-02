import React from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import { BackgroundView } from '@apollosproject/ui-kit';
import { storiesOf } from '@apollosproject/ui-storybook';
import { CardFeed } from '../../CardFeeds';
import mockData from './GroupCardMockData';
import GroupCard from '.';

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

storiesOf('cf-ui/GroupCard', module).add('default', () => (
  <BackgroundView>
    <SafeAreaView>
      <ScrollView>
        <CardFeed
          content={[mockData, mockData, mockData]}
          navigation={mockNavigation}
          card={GroupCard}
          loadingStateObject={loadingStateObject}
        />
      </ScrollView>
    </SafeAreaView>
  </BackgroundView>
));

storiesOf('cf-ui/GroupCard', module).add('Horizontal Feed', () => (
  <BackgroundView>
    <SafeAreaView>
      <ScrollView>
        <CardFeed
          content={[mockData, mockData, mockData]}
          navigation={mockNavigation}
          horizontal
          card={GroupCard}
          loadingStateObject={loadingStateObject}
        />
      </ScrollView>
    </SafeAreaView>
  </BackgroundView>
));
