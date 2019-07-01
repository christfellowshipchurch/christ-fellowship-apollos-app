import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';

import ContentTableCardItem from './ContentTableCardItem';

const item = {
  id: 'UniversalContentItem:9d06423a8908b7cc1e1f2db6156c1bfb',
  title: 'Hello 1',
  parentChannel: {
    id: 'ContentChannel:be35f49307d7297989d3514be788ef2d',
    name: 'NewSpring - Articles',
  },
  coverImage: {
    sources: {
      uri: 'https://picsum.photos/600/400/?image=63',
    },
  },
};

storiesOf('ContentTableCardItem', module).add('simple', () => (
  <ContentTableCardItem
    onPress={() => {}}
    imageSource={item.coverImage.sources}
    label={item.parentChannel.name}
    title={item.title}
    id={item.id}
  />
));
