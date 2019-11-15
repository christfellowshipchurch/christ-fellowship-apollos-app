import React from 'react'
import { ScrollView } from 'react-native'
import PropTypes from 'prop-types'

import Events from './events'
import {
  TableView, Cell
} from 'ChristFellowship/src/ui/TableView'

const More = ({ navigation }) => (
  <ScrollView>
    <TableView>
      <Cell
        icon='calendar-alt'
        title='Events'
        onPress={() => navigation.navigate('Events')}
      />
    </TableView>
  </ScrollView>
)

More.navigationOptions = {
  title: 'More',
  headerMore: 'screen'
}

More.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
    navigate: PropTypes.func,
  }),
}

export default More
