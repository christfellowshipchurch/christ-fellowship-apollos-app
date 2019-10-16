import React from 'react'
import { ScrollView } from 'react-native'
import PropTypes from 'prop-types'
import {
  TableView, Cell
} from 'ChristFellowship/src/ui/TableView'

const More = ({ navigation }) => (
  <ScrollView>
    <TableView>
      <Cell icon='map-marked-alt' title='Church Locations' onPress={() => { }} />
      <Cell icon='user-friends' title='Church Leadership' onPress={() => { }} />
      <Cell icon='bible' title='Church Beliefs' onPress={() => { }} />
      <Cell icon='book' title='Leadership Values' onPress={() => { }} />
      <Cell icon='mobile' title='Privacy, Terms of Use, Feedback' onPress={() => { }} />
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
