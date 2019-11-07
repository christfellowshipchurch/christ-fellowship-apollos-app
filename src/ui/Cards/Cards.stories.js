import React from 'react'
import { storiesOf } from '@apollosproject/ui-storybook'
import { FlexedView } from '@apollosproject/ui-kit'

import { TinyCard } from '.'

storiesOf('LandingScreen', module)
    .add('Tiny Card', () => (
        <FlexedView
            style={{
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'gray'
            }}
        >
            <TinyCard
                coverImage={[{ uri: 'https://dev-rock.christfellowship.church/GetImage.ashx?guid=aad6b010-a105-47e5-8ad2-4e1a03a872e9' }]}
                tags={["Label"]}
                title="This is the Card Title"
            />
        </FlexedView>
    ))
