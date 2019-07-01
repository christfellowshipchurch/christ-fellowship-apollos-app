import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';
import { H3 } from '@apollosproject/ui-kit';
import ContentTableCard from '.';

const content = [
  {
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
  },
  {
    id: 'UniversalContentItem:9d06423a8908b7cc1e1f2db6156c1bfb',
    title: 'Hello 2',
    parentChannel: {
      id: 'ContentChannel:be35f49307d7297989d3514be788ef2d',
      name: 'NewSpring - Articles',
    },
    coverImage: {
      sources: {
        uri: 'https://picsum.photos/600/400/?image=63',
      },
    },
  },
  {
    id: 'UniversalContentItem:9d06423a8908b7cc1e1f2db6156c1bfb',
    title: 'Hello 3',
    parentChannel: {
      id: 'ContentChannel:be35f49307d7297989d3514be788ef2d',
      name: 'NewSpring - Articles',
    },
    coverImage: {
      sources: {
        uri: 'https://picsum.photos/600/400/?image=63',
      },
    },
  },
  {
    id: 'UniversalContentItem:9d06423a8908b7cc1e1f2db6156c1bfb',
    title: 'Hello 4',
    parentChannel: {
      id: 'ContentChannel:be35f49307d7297989d3514be788ef2d',
      name: 'NewSpring - Articles',
    },
    coverImage: {
      sources: {
        uri: 'https://picsum.photos/600/400/?image=63',
      },
    },
  },
];

storiesOf('ContentTableCard', module)
  .add('simple', () => (
    <ContentTableCard
      label={'FOR YOU'}
      onPress={() => {}}
      content={content}
      DynamicHeader={
        <H3 numberOfLines={3} ellipsizeMode="tail">
          Some random text that encourages you
        </H3>
      }
    />
  ))
  .add('isLoading', () => (
    <ContentTableCard
      label={'FOR YOU'}
      onPress={() => {}}
      isLoading
      content={content}
      DynamicHeader={
        <H3 isLoading numberOfLines={3} ellipsizeMode="tail">
          Some random text that encourages you
        </H3>
      }
    />
  ));
