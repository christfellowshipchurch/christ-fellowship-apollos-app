import React from 'react';
import { storiesOf } from '@storybook/react-native';

import AskName from '.';

storiesOf('Onboarding/slides/AskName', module)
  .add('default', () => <AskName setFieldValue={() => {}} />)
  .add('slideTitle', () => (
    <AskName slideTitle={'Custom title text'} setFieldValue={() => {}} />
  ))
  .add('description', () => (
    <AskName description={'Custom description text'} setFieldValue={() => {}} />
  ))
  .add('firstName and lastName', () => (
    <AskName
      values={{ firstName: 'Marty', lastName: 'McFly' }}
      setFieldValue={() => {}}
    />
  ))
  .add('SlideWrapper props', () => (
    <AskName setFieldValue={() => {}} onPressPrimary={() => {}} />
  ));
