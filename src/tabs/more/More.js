import React from 'react'
import { SafeAreaView, ScrollView } from 'react-native'
import PropTypes from 'prop-types'
import {
  H4,
  H3,
  styled,
  BackgroundView,
  FlexedView
} from '@apollosproject/ui-kit';
import { 
  faUsers,
  faHandshake,
  faCalendarAlt,
  faEnvelopeOpenDollar,
  faSearch,
} from '@fortawesome/pro-light-svg-icons'

import Events from './events'
import {
  TableView, Cell
} from 'ChristFellowship/src/ui/TableView'

const HeaderTitle = styled(({ theme, active }) => ({
  fontWeight: 'bold',
  textAlign: 'center',
}))(H3)

const HeaderSubTitle = styled(({ theme, active }) => ({
  fontWeight: 'bold',
  fontSize: 18,
  padding: 20
}))(H4)

const More = ({ navigation }) => (
        <ScrollView>

          <HeaderTitle>
            More
          </HeaderTitle>

          <HeaderSubTitle>
            Get Involved
          </HeaderSubTitle>

          <TableView>
            <Cell
              icon={faCalendarAlt}
              title='Groups'
              onPress={() => navigation.navigate('Events')}
            />
            <Cell
              icon={faUsers}
              title='Serve'
              onPress={() => navigation.navigate('Events')}
            />
            <Cell
              icon={faHandshake}
              title='Events'
              onPress={() => navigation.navigate('Events')}
            />
            <Cell
              icon={faEnvelopeOpenDollar}
              title='Give'
              onPress={() => navigation.navigate('Events')}
            />
          </TableView>

          <HeaderSubTitle>
            Our Church
        </HeaderSubTitle>

          <TableView>
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
