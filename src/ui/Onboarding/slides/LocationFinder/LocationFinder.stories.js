import React from 'react';
import { storiesOf } from '@storybook/react-native';

import { GradientOverlayImage } from '@apollosproject/ui-kit';

import LocationFinder from './LocationFinder';

storiesOf('Onboarding/slides/LocationFinder', module)
  .add('default', () => <LocationFinder />)
  .add('children (image)', () => (
    <LocationFinder>
      <GradientOverlayImage source={'https://picsum.photos/640/640/?random'} />
    </LocationFinder>
  ))
  .add('slideTitle', () => <LocationFinder slideTitle={'Custom title text'} />)
  .add('description', () => (
    <LocationFinder description={'Custom description text'} />
  ))
  .add('campus', () => (
    <LocationFinder
      campus={{
        id: 'Campus:a0f64573eabf00a607bec911794d50fb',
        name: 'Lyon Estates',
        latitude: 42.09203,
        longitude: -88.13289,
        distanceFromLocation: 88,
        street1: '9303 Lyon Drive',
        street2: '',
        city: 'Hill Valley',
        state: 'CA',
        postalCode: '95420',
        image: {
          uri: 'https://picsum.photos/300/300/?random',
        },
      }}
    />
  ))
  .add('buttonText', () => (
    <LocationFinder
      onPressButton={() => {}}
      buttonText={'Custom button text'}
    />
  ))
  .add('SlideWrapper props', () => (
    <LocationFinder onPressSecondary={() => {}} />
  ));
