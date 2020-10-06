import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';
import mockData from './HorizontalGroupCardMockData';
import HorizontalGroupCard from '.';

storiesOf('cf-ui/HorizontalGroupCard', module).add('default', () => (
  <HorizontalGroupCard {...mockData} />
));
