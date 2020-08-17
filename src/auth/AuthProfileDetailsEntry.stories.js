import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';
import { ThemeMixin } from '@apollosproject/ui-kit';

import AuthBackground from 'ui/AuthBackground';
import AuthProfileDetailsEntry from './AuthProfileDetailsEntry';

storiesOf('cf-ui-onboarding/slides/AboutYou', module).add('default', () => (
  <ThemeMixin mixin={{ type: 'onboarding' }}>
    <AuthProfileDetailsEntry
      setFieldValue={() => { }}
      Component={AuthProfileDetailsEntry}
      BackgroundComponent={AuthBackground}
    />
  </ThemeMixin>
));
