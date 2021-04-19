import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';
import { ThemeMixin } from '@apollosproject/ui-kit';

import AuthProfileDetailsEntry from './AuthProfileDetailsEntry';

storiesOf('cf-ui-onboarding/slides/AboutYou', module).add('default', () => (
  <AuthProfileDetailsEntry
    setFieldValue={() => {}}
    setFieldError={() => {}}
    Component={AuthProfileDetailsEntry}
  />
));
