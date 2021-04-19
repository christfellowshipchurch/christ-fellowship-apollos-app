import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
import { storiesOf } from '@apollosproject/ui-storybook';
import { take } from 'lodash';
import Slider from '@react-native-community/slider';
import {
  BackgroundView,
  UIText,
  PaddedView,
  HorizontalHighlightCard,
} from '@apollosproject/ui-kit';
import CardFeed from './CardFeed';

import mockContent from './CardFeedDataMock';

const mockNavigation = {
  navigate: () => null,
};

const loadingStateObject = {
  id: 'fakeId0',
  isLoading: true,
  title: 'Boom',
  coverImage: [],
  // We need to assume a typename so horizontalContentCardComponentMapper knows what "type" to render
  __typename: 'MediaContentItem',
};

const CardFeedWithSlider = ({ FeedProps }) => {
  const [numCards, setNumCards] = useState(mockContent.length);
  return (
    <ScrollView>
      <PaddedView>
        <UIText bold>Number of Cards</UIText>
        <Slider
          minimumValue={1}
          maximumValue={mockContent.length}
          step={1}
          value={numCards}
          onValueChange={(newValue) => setNumCards(newValue)}
        />
      </PaddedView>
      <CardFeed
        content={take(mockContent, numCards)}
        navigation={mockNavigation}
        horizontal
        {...FeedProps}
        key={numCards}
        card={HorizontalHighlightCard}
        loadingStateObject={loadingStateObject}
      />
    </ScrollView>
  );
};

storiesOf('cf-ui/HorizontalCardFeed', module).add('default', () => (
  <BackgroundView>
    <SafeAreaView>
      <ScrollView>
        <CardFeedWithSlider />
      </ScrollView>
    </SafeAreaView>
  </BackgroundView>
));

storiesOf('cf-ui/HorizontalCardFeed', module).add('isLoading', () => (
  <BackgroundView>
    <SafeAreaView>
      <ScrollView>
        <CardFeed
          isLoading
          // navigation={mockNavigation}
          horizontal
          card={HorizontalHighlightCard}
          loadingStateObject={loadingStateObject}
        />
      </ScrollView>
    </SafeAreaView>
  </BackgroundView>
));

storiesOf('cf-ui/HorizontalCardFeed', module).add('error', () => (
  <BackgroundView>
    <SafeAreaView>
      <ScrollView>
        <CardFeed
          error="Here is some error"
          navigation={mockNavigation}
          horizontal
          card={HorizontalHighlightCard}
          loadingStateObject={loadingStateObject}
        />
      </ScrollView>
    </SafeAreaView>
  </BackgroundView>
));

storiesOf('cf-ui/HorizontalCardFeed', module).add('content + isLoading', () => (
  <BackgroundView>
    <SafeAreaView>
      <ScrollView>
        <PaddedView>
          <UIText bold>
            TL;DR - if content is updating, the old content will still be
            visible while new content is loading
          </UIText>
        </PaddedView>
        <PaddedView>
          <UIText>
            If the component is in a loading state, but already has valid data
            passed into it, we will still render the visible content. Once the
            parent is done refetching, the state of the `content` will be
            updated and reflect the new content.
          </UIText>
        </PaddedView>
        <CardFeed
          content={mockContent}
          isLoading
          navigation={mockNavigation}
          horizontal
          card={HorizontalHighlightCard}
          loadingStateObject={loadingStateObject}
        />
      </ScrollView>
    </SafeAreaView>
  </BackgroundView>
));

storiesOf('cf-ui/HorizontalCardFeed', module).add('title and see more', () => (
  <BackgroundView>
    <SafeAreaView>
      <ScrollView>
        <CardFeedWithSlider
          FeedProps={{
            title: 'This is my title',
            onPressHeader: () => console.log('Card Feed title and see more'),
          }}
        />
      </ScrollView>
    </SafeAreaView>
  </BackgroundView>
));

storiesOf('cf-ui/HorizontalCardFeed', module).add(
  'title without see more',
  () => (
    <BackgroundView>
      <SafeAreaView>
        <ScrollView>
          <CardFeedWithSlider
            FeedProps={{
              title: 'This is my title',
              seeMore: false,
            }}
          />
        </ScrollView>
      </SafeAreaView>
    </BackgroundView>
  )
);

storiesOf('cf-ui/HorizontalCardFeed', module).add('title loading', () => (
  <BackgroundView>
    <SafeAreaView>
      <ScrollView>
        <CardFeed
          title="This is my title"
          isLoading
          navigation={mockNavigation}
          horizontal
          card={HorizontalHighlightCard}
          loadingStateObject={loadingStateObject}
        />
      </ScrollView>
    </SafeAreaView>
  </BackgroundView>
));
