import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
import Slider from '@react-native-community/slider';
import { storiesOf } from '@apollosproject/ui-storybook';
import { take } from 'lodash';
import { BackgroundView, UIText, PaddedView } from '@apollosproject/ui-kit';
import mockContent from '../../../ui/CardFeeds/CardFeedDataMock';
import VerticalCardListFeature from '.';

const mockNavigation = {
  navigate: () => null,
};

const VerticalCardListFeatureWithSlider = ({ FeedProps }) => {
  const [numCards, setNumCards] = useState(4);
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
      <VerticalCardListFeature
        content={take(mockContent, numCards)}
        navigation={mockNavigation}
        {...FeedProps}
        key={numCards}
      />
    </ScrollView>
  );
};

VerticalCardListFeatureWithSlider.propTypes = {
  FeedProps: PropTypes.shape({}),
};

storiesOf('cf-features/VerticalCardListFeature', module).add('default', () => (
  <BackgroundView>
    <SafeAreaView>
      <VerticalCardListFeatureWithSlider />
    </SafeAreaView>
  </BackgroundView>
));

storiesOf('cf-features/VerticalCardListFeature', module).add(
  'isLoading',
  () => (
    <BackgroundView>
      <SafeAreaView>
        <ScrollView>
          <VerticalCardListFeature isLoading navigation={mockNavigation} />
        </ScrollView>
      </SafeAreaView>
    </BackgroundView>
  )
);

storiesOf('cf-features/VerticalCardListFeature', module).add('error', () => (
  <BackgroundView>
    <SafeAreaView>
      <ScrollView>
        <VerticalCardListFeature
          error="Here is some error"
          navigation={mockNavigation}
        />
      </ScrollView>
    </SafeAreaView>
  </BackgroundView>
));

storiesOf('cf-features/VerticalCardListFeature', module).add(
  'content + isLoading',
  () => (
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
          <VerticalCardListFeature
            content={mockContent}
            isLoading
            navigation={mockNavigation}
          />
        </ScrollView>
      </SafeAreaView>
    </BackgroundView>
  )
);

storiesOf('cf-features/VerticalCardListFeature', module).add(
  'title and see more',
  () => (
    <BackgroundView>
      <SafeAreaView>
        <ScrollView>
          <VerticalCardListFeatureWithSlider
            FeedProps={{
              title: 'This is my title',
              onPressHeader: () =>
                console.log('Grid Card Feed title and see more'),
            }}
          />
        </ScrollView>
      </SafeAreaView>
    </BackgroundView>
  )
);

storiesOf('cf-features/VerticalCardListFeature', module).add(
  'title without see more',
  () => (
    <BackgroundView>
      <SafeAreaView>
        <ScrollView>
          <VerticalCardListFeatureWithSlider
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

storiesOf('cf-features/VerticalCardListFeature', module).add(
  'title loading',
  () => (
    <BackgroundView>
      <SafeAreaView>
        <ScrollView>
          <VerticalCardListFeature
            title="This is my title"
            isLoading
            navigation={mockNavigation}
          />
        </ScrollView>
      </SafeAreaView>
    </BackgroundView>
  )
);
