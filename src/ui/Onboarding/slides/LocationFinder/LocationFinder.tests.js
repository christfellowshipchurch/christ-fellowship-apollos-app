import React from 'react';
import renderer from 'react-test-renderer';

import { GradientOverlayImage } from '@apollosproject/ui-kit';
import Providers from 'ChristFellowship/src/Providers';

import LocationFinder from './LocationFinder';

const campus = {
  id: 'Campus:a0f64573eabf00a607bec911794d50fb',
  name: 'Chicago Campus',
  latitude: 42.09203,
  longitude: -88.13289,
  distanceFromLocation: null,
  street1: '67 Algonquin Rd',
  street2: '',
  city: 'South Barrington',
  state: 'IL',
  postalCode: '60010-6143',
  image: {
    uri: 'https://picsum.photos/300/300/?random',
  },
};

describe('The Onboarding LocationFinder component', () => {
  it('should render', () => {
    const tree = renderer.create(
      <Providers>
        <LocationFinder />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render children (image)', () => {
    const tree = renderer.create(
      <Providers>
        <LocationFinder>
          <GradientOverlayImage
            source={'https://picsum.photos/640/640/?random'}
          />
        </LocationFinder>
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a custom title', () => {
    const tree = renderer.create(
      <Providers>
        <LocationFinder slideTitle={'Custom title text'} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a custom description', () => {
    const tree = renderer.create(
      <Providers>
        <LocationFinder description={'Custom description text'} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render with a button', () => {
    const tree = renderer.create(
      <Providers>
        <LocationFinder onPressButton={jest.fn()} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render the button disabled', () => {
    const tree = renderer.create(
      <Providers>
        <LocationFinder
          onPressButton={jest.fn()}
          buttonDisabled
          campus={campus}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render a button with custom text', () => {
    const tree = renderer.create(
      <Providers>
        <LocationFinder
          onPressButton={jest.fn()}
          buttonText={'Custom button text'}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('should pass additional props to Slide component', () => {
    const tree = renderer.create(
      <Providers>
        <LocationFinder
          onPressSecondary={jest.fn()}
          secondaryNavText={'Later'}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
