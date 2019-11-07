import React from 'react'

import { View } from 'react-native'
import { FlexedView } from '@apollosproject/ui-kit'
import {
  storiesOf
} from '@apollosproject/ui-storybook'
import FilterRow from '.'

const content = [
  { title: "All" },
  { title: "Articles" },
  { title: "Videos" },
  { title: "Podcasts" },
]

storiesOf('Browse', module)
  .add('FilterRow', () => (
    <FlexedView>
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-end'
        }}
      >
        <FilterRow
          filters={content}
        />
      </View>
      <View
        style={{
          flex: 5,
          backgroundColor: "gray"
        }}
      >

      </View>
    </FlexedView>
  ))
