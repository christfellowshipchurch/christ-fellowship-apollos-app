import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { GradientOverlayImage } from '@apollosproject/ui-kit';

import AskNotifications from './AskNotifications';

storiesOf('Onboarding/slides/AskNotifications', module)
  .add('default', () => <AskNotifications />)
  .add('children (image)', () => (
    <AskNotifications>
      <GradientOverlayImage source={'https://picsum.photos/640/640/?random'} />
    </AskNotifications>
  ))
  .add('slideTitle', () => (
    <AskNotifications slideTitle={'Custom title text'} />
  ))
  .add('description', () => (
    <AskNotifications description={'Custom description text'} />
  ))
  .add('buttonDisabled', () => <AskNotifications buttonDisabled />)
  .add('buttonText', () => (
    <AskNotifications
      onPressButton={() => {}}
      buttonText={'Custom button text'}
    />
  ))
  .add('SlideWrapper props', () => (
    <AskNotifications onPressSecondary={() => {}} />
  ));
