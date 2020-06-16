import React, { useState } from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import { storiesOf } from '@apollosproject/ui-storybook';
import { take } from 'lodash';
import Slider from '@react-native-community/slider';
import { BackgroundView, UIText, PaddedView } from '@apollosproject/ui-kit';
import mockContent from '../CardFeedDataMock';
import HeroCardFeed from '.';

const mockNavigation = {
    navigate: () => null,
};

const HeroCardFeedWithSlider = ({ FeedProps }) => {
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
            <HeroCardFeed
                content={take(mockContent, numCards)}
                navigation={mockNavigation}
                {...FeedProps}
                key={numCards}
            />
        </ScrollView>
    );
};

storiesOf('cf-ui/HeroCardFeed', module).add('default', () => (
    <BackgroundView>
        <SafeAreaView>
            <ScrollView>
                <HeroCardFeedWithSlider />
            </ScrollView>
        </SafeAreaView>
    </BackgroundView>
));

storiesOf('cf-ui/HeroCardFeed', module).add('isLoading', () => (
    <BackgroundView>
        <SafeAreaView>
            <ScrollView>
                <HeroCardFeed isLoading navigation={mockNavigation} />
            </ScrollView>
        </SafeAreaView>
    </BackgroundView>
));

storiesOf('cf-ui/HeroCardFeed', module).add('error', () => (
    <BackgroundView>
        <SafeAreaView>
            <ScrollView>
                <HeroCardFeed error="Here is some error" navigation={mockNavigation} />
            </ScrollView>
        </SafeAreaView>
    </BackgroundView>
));

storiesOf('cf-ui/HeroCardFeed', module).add('content + isLoading', () => (
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
                <HeroCardFeed
                    content={mockContent}
                    isLoading
                    navigation={mockNavigation}
                />
            </ScrollView>
        </SafeAreaView>
    </BackgroundView>
));

storiesOf('cf-ui/HeroCardFeed', module).add('title and see more', () => (
    <BackgroundView>
        <SafeAreaView>
            <ScrollView>
                <HeroCardFeedWithSlider
                    FeedProps={{
                        title: 'This is my title',
                        onPressHeader: () =>
                            console.log('Hero Card Feed title and see more'),
                    }}
                />
            </ScrollView>
        </SafeAreaView>
    </BackgroundView>
));

storiesOf('cf-ui/HeroCardFeed', module).add('title without see more', () => (
    <BackgroundView>
        <SafeAreaView>
            <ScrollView>
                <HeroCardFeedWithSlider
                    FeedProps={{
                        title: 'This is my title',
                        onPressHeader: () =>
                            console.log('Hero Card Feed title and see more'),
                    }}
                />
            </ScrollView>
        </SafeAreaView>
    </BackgroundView>
));

storiesOf('cf-ui/HeroCardFeed', module).add('title loading', () => (
    <BackgroundView>
        <SafeAreaView>
            <ScrollView>
                <HeroCardFeed
                    title="This is my title"
                    isLoading
                    navigation={mockNavigation}
                />
            </ScrollView>
        </SafeAreaView>
    </BackgroundView>
));
