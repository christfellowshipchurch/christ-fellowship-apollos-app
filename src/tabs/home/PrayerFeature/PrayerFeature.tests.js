import React from 'react';
import renderer from 'react-test-renderer';

import { Providers } from '../testUtils';

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
      photo: { uri: 'https://picsum.photos/200' },
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

describe('The PrayerFeature component', () => {
  it('should render', () => {
    const tree = renderer.create(
      <Providers>
        <PrayerFeature prayers={prayers} />
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
  it('should render without a `Card` border', () => {
    const tree = renderer.create(
      <Providers>
        <PrayerFeature prayers={prayers} isCard={false} />
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
  it('should render a loading state', () => {
    const tree = renderer.create(
      <Providers>
        <PrayerFeature prayers={prayers} isLoading title={'Example title'} />
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
  it('should render a loading state without a `Card` border', () => {
    const tree = renderer.create(
      <Providers>
        <PrayerFeature
          prayers={[{}, {}, {}, {}, {}, {}]}
          isCard={false}
          isLoading
          title={'Example title'}
        />
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
  it('should accept an onPressAdd function', () => {
    const tree = renderer.create(
      <Providers>
        <PrayerFeature prayers={prayers} onPressAdd={jest.fn()} />
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
  it('should accept an onPressAvatar function', () => {
    const tree = renderer.create(
      <Providers>
        <PrayerFeature prayers={prayers} onPressAvatar={jest.fn()} />
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
  it('should render with a title', () => {
    const tree = renderer.create(
      <Providers>
        <PrayerFeature prayers={prayers} title={'Example title'} />
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
  it('should render with a custom subtitle', () => {
    const tree = renderer.create(
      <Providers>
        <PrayerFeature prayers={prayers} subtitle={'Custom subtitle'} />
      </Providers>
    );

    expect(tree).toMatchSnapshot();
  });
});
