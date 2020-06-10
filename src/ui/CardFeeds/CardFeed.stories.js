import React from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import { storiesOf } from '@apollosproject/ui-storybook';
import { drop } from 'lodash';
import { BackgroundView, UIText, PaddedView } from '@apollosproject/ui-kit';
import CardFeed from './CardFeed';

import mockContent from './CardFeedDataMock';

const mockNavigation = {
    navigate: () => null,
};

storiesOf('cf-ui/CardFeed', module).add('default', () => (
    <BackgroundView>
        <SafeAreaView>
            <ScrollView>
                <CardFeed content={mockContent} navigation={mockNavigation} />
            </ScrollView>
        </SafeAreaView>
    </BackgroundView>
));

storiesOf('cf-ui/CardFeed', module).add('isLoading', () => (
    <BackgroundView>
        <SafeAreaView>
            <ScrollView>
                <CardFeed isLoading navigation={mockNavigation} />
            </ScrollView>
        </SafeAreaView>
    </BackgroundView>
));

storiesOf('cf-ui/CardFeed', module).add('error', () => (
    <BackgroundView>
        <SafeAreaView>
            <ScrollView>
                <CardFeed error="Here is some error" navigation={mockNavigation} />
            </ScrollView>
        </SafeAreaView>
    </BackgroundView>
));

storiesOf('cf-ui/CardFeed', module).add('content + isLoading', () => (
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
                <CardFeed content={mockContent} isLoading navigation={mockNavigation} />
            </ScrollView>
        </SafeAreaView>
    </BackgroundView>
));

storiesOf('cf-ui/CardFeed', module).add('content of odd length', () => (
    <BackgroundView>
        <SafeAreaView>
            <ScrollView>
                <PaddedView>
                    <UIText bold>
                        For large displays, this displays what the component looks like with
                        an odd length of content
          </UIText>
                </PaddedView>
                <CardFeed
                    content={drop(mockContent)}
                    isLoading
                    navigation={mockNavigation}
                />
            </ScrollView>
        </SafeAreaView>
    </BackgroundView>
));
