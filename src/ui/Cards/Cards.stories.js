import React from 'react';
import { storiesOf } from '@apollosproject/ui-storybook';
import { View } from 'react-native';
import { FlexedView } from '@apollosproject/ui-kit';

import { TinyCard, StackedImageCard } from '.';

storiesOf('LandingScreen', module)
  .add('Tiny Card', () => (
    <FlexedView
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'gray',
      }}
    >
      <TinyCard
        coverImage={[
          {
            uri:
              'https://dev-rock.christfellowship.church/GetImage.ashx?guid=aad6b010-a105-47e5-8ad2-4e1a03a872e9',
          },
        ]}
        tags={['Label']}
        title="This is the Card Title"
      />
    </FlexedView>
  ))
  .add('Stacked Image Card', () => (
    <FlexedView
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'gray',
      }}
    >
      <View style={{ height: '50%' }}>
        <StackedImageCard
          coverImage={[
            {
              uri:
                'https://dev-rock.christfellowship.church/GetImage.ashx?guid=aad6b010-a105-47e5-8ad2-4e1a03a872e9',
            },
          ]}
          title="This is the Card Title"
          summary="This is the summary of the card that should be shown"
        />
      </View>
    </FlexedView>
  ));
