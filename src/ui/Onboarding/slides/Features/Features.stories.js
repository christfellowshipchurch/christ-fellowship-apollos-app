import React from 'react';
import { storiesOf } from '@storybook/react-native';

import Features from '.';

storiesOf('Onboarding/slides/Features', module)
  .add('default', () => <Features />)
  .add('withImg', () => (
    <Features imgSrc={{ uri: 'https://picsum.photos/1200/1200?random' }} />
  ))
  .add('firstName', () => <Features firstName={'firstName'} />)
  .add('slideTitle', () => <Features slideTitle={'Custom title text'} />)
  .add('description', () => (
    <Features description={'Custom description text'} />
  ))
  .add('Slide props', () => <Features onPressPrimary={() => {}} />);
