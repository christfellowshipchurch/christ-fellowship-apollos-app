import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';

import UserAvatarView from '.';

storiesOf('UserAvatarView', module)
  .add('example', () => (
    <UserAvatarView
      photo={'https://picsum.photos/400/400/?random'}
      firstName={'Marty'}
      lastName={'McFly'}
      location={'Hill Valley'}
    />
  ))
  .add('isLoading', () => (
    <UserAvatarView
      photo={'https://picsum.photos/400/400/?random'}
      firstName={'Marty'}
      lastName={'McFly'}
      location={'Hill Valley'}
      isLoading
    />
  ));
