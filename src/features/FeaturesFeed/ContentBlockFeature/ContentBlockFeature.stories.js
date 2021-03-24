import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
import { storiesOf } from '@apollosproject/ui-storybook';
import { BackgroundView } from '@apollosproject/ui-kit';
import ContentBlockFeature from './ContentBlockFeature';

const mockData = {
  title: 'My Content Title',
  summary: 'This is my summary',
  htmlContent:
    '<p>Save the date—February 14—for one of the biggest Sundays of the year, as Pastors Todd &amp; Julie share the vision for our church in 2021. We can’t wait to share the incredible things Jesus is calling us to do this year and the important role you play in the vision. Join in person or online!</p>',
  coverImage: {
    sources: [
      {
        uri:
          'https://cloudfront.christfellowship.church/GetImage.ashx?guid=e8f61942-86a9-4c64-a3bd-8838d284a1db',
      },
    ],
  },
};

const videoData = {
  videos: [
    {
      uri:
        'https://link.theplatform.com/s/IfSiAC/media/lLAPAkVDj_sd/file.m3u8?format=redirect&formats=m3u,mpeg4',
    },
  ],
};

storiesOf('cf-ui/ContentBlockFeature', module).add('default', () => (
  <BackgroundView>
    <SafeAreaView>
      <ScrollView>
        <ContentBlockFeature {...mockData} />
        <ContentBlockFeature {...mockData} {...videoData} />
      </ScrollView>
    </SafeAreaView>
  </BackgroundView>
));

storiesOf('cf-ui/ContentBlockFeature', module).add('inverted', () => (
  <BackgroundView>
    <SafeAreaView>
      <ScrollView>
        <ContentBlockFeature {...mockData} orientation="INVERTED" />
        <ContentBlockFeature
          {...mockData}
          {...videoData}
          orientation="INVERTED"
        />
      </ScrollView>
    </SafeAreaView>
  </BackgroundView>
));

storiesOf('cf-ui/ContentBlockFeature', module).add('left', () => (
  <BackgroundView>
    <SafeAreaView>
      <ScrollView>
        <ContentBlockFeature {...mockData} orientation="LEFT" />
        <ContentBlockFeature {...mockData} {...videoData} orientation="LEFT" />
      </ScrollView>
    </SafeAreaView>
  </BackgroundView>
));

storiesOf('cf-ui/ContentBlockFeature', module).add('right', () => (
  <BackgroundView>
    <SafeAreaView>
      <ScrollView>
        <ContentBlockFeature {...mockData} orientation="RIGHT" />
        <ContentBlockFeature {...mockData} {...videoData} orientation="RIGHT" />
      </ScrollView>
    </SafeAreaView>
  </BackgroundView>
));
