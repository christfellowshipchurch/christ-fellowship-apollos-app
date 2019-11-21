import React from 'react'
import { ScrollView } from 'react-native'
import SafeAreaView from 'react-native-safe-area-view'
import PropTypes from 'prop-types'
import {
  H4,
  H3,
  styled,
  BackgroundView,
  FlexedView,
  withTheme
} from '@apollosproject/ui-kit'

import {
  TableView, Cell
} from 'ChristFellowship/src/ui/TableView'

const HeaderTitle = styled(({ theme, active }) => ({
  fontWeight: 'bold',
  textAlign: 'center',
  paddingVertical: theme.sizing.baseUnit
}))(H3)

const More = ({ navigation }) => (
  <BackgroundView>
    <SafeAreaView forceInset={{ bottom: 'never' }}>
      <HeaderTitle>
        More
      </HeaderTitle>
      <ScrollView>
        <TableView title='Get Involved'>
          <Cell
            icon='handshake'
            title='Groups'
            onPress={() => navigation.navigate('Events')}
          />
          <Cell
            icon='users'
            title='Serve'
            onPress={() => navigation.navigate('Events')}
          />
          <Cell
            icon='calendar-alt'
            title='Events'
            onPress={() => navigation.navigate('Events')}
          />
          <Cell
            icon='envelope-open-dollar'
            title='Give'
            onPress={() => navigation.navigate('Events')}
          />
        </TableView>

        <TableView title='Our Church' padded>
          <Cell
            title='About Christ Fellowship'
            onPress={() => navigation.navigate('Events')}
          />
          <Cell
            title='Church Locations'
            onPress={() => navigation.navigate('Events')}
          />
          <Cell
            title='Contact'
            onPress={() => navigation.navigate('Events')}
          />
        </TableView>
      </ScrollView>
    </SafeAreaView>
  </BackgroundView>
)

More.navigationOptions = {
  title: 'More',
  header: null
}

More.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
    navigate: PropTypes.func,
  }),
}

export default More
