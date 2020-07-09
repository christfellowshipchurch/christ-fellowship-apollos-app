import React from 'react';

import { storiesOf } from '@apollosproject/ui-storybook';
import { CenteredView } from '@apollosproject/ui-kit';

import PrayerFeature from '.';

const prayers = [
  {
    id: '1',
    isPrayed: false,
    requestor: {
      photo: { uri: 'https://picsum.photos/200' },
    },
  },
  {
    id: '2',
    isPrayed: false,
    requestor: {
      photo: { uri: 'https://picsum.photos/200' },
    },
  },
  {
    id: '3',
    isPrayed: false,
    requestor: {
      photo: { uri: '' },
    },
  },
  {
    id: '4',
    isPrayed: true,
    requestor: {
      photo: { uri: 'https://picsum.photos/200' },
    },
  },
  {
    id: '5',
    isPrayed: true,
    requestor: {
      photo: { uri: 'https://picsum.photos/200' },
    },
  },
  {
    id: '6',
    isPrayed: true,
    requestor: {
      photo: { uri: 'https://picsum.photos/200' },
    },
  },
  {
    id: '7',
    isPrayed: true,
    requestor: {
      photo: { uri: 'https://picsum.photos/200' },
    },
  },
  {
    id: '8',
    isPrayed: true,
    requestor: {
      photo: { uri: 'https://picsum.photos/200' },
    },
  },
];

storiesOf('ui-prayer/PrayerFeature', module)
  .addDecorator((story) => (
    <CenteredView style={{ alignItems: 'stretch' /* eslint-disable-line */ }}>
      {story()}
    </CenteredView>
  ))
  .add('example', () => (
    <PrayerFeature
      prayers={prayers}
      onPressAdd={() => {}}
      title={'Example title'}
      subtitle={'Custom Subtitle'}
    />
  ))
  .add('default', () => <PrayerFeature prayers={prayers} />)
  .add('isCard (false)', () => (
    <PrayerFeature prayers={prayers} isCard={false} title={'Example title'} />
  ))
  .add('isLoading', () => {
    const emptyData = [
      {
        id: '1',
        source: { uri: '' },
      },
      {
        id: '2',
        source: { uri: '' },
      },
      {
        id: '3',
        source: { uri: '' },
      },
      {
        id: '4',
        source: { uri: '' },
      },
      {
        id: '5',
        source: { uri: '' },
      },
      {
        id: '6',
        source: { uri: '' },
      },
      {
        id: '7',
        source: { uri: '' },
      },
      {
        id: '8',
        source: { uri: '' },
      },
    ];
    return (
      <PrayerFeature
        prayers={emptyData}
        isLoading
        title={'Example title'}
        isCard={false}
      />
    );
  })
  .add('onPressAdd', () => (
    <PrayerFeature prayers={prayers} onPressAdd={() => {}} />
  ))
  .add('title', () => (
    <PrayerFeature prayers={prayers} title={'Example title'} />
  ))
  .add('subtitle', () => (
    <PrayerFeature prayers={prayers} subtitle={'Custom Subtitle'} />
  ));
