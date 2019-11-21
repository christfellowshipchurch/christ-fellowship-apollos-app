import React from 'react'
import { ScrollView, Linking } from 'react-native'
import SafeAreaView from 'react-native-safe-area-view'
import PropTypes from 'prop-types'
import {
  H3,
  styled,
  BackgroundView,
} from '@apollosproject/ui-kit'

import {
  TableView, Cell
} from 'ChristFellowship/src/ui/TableView'
import { WebBrowserConsumer } from 'ChristFellowship/src/ui/WebBrowser'

const HeaderTitle = styled(({ theme, active }) => ({
  fontWeight: 'bold',
  textAlign: 'center',
  paddingVertical: theme.sizing.baseUnit
}))(H3)

const More = ({
  navigation,
  givingUrl,
}) => (
    <BackgroundView>
      <SafeAreaView forceInset={{ bottom: 'never' }}>
        <HeaderTitle>
          More
        </HeaderTitle>
        <WebBrowserConsumer>
          {(openUrl) => (
            <ScrollView>
              <TableView title='Get Involved'>
                <Cell
                  icon='users'
                  title='Groups'
                  onPress={() => openUrl('https://rock.gocf.org/groups')}
                />
                <Cell
                  icon='handshake'
                  title='Serve'
                  onPress={() => openUrl('https://rock.gocf.org/dreamteam')}
                />
                <Cell
                  icon='calendar-alt'
                  title='Events'
                  onPress={() => navigation.navigate('Events')}
                />
                <Cell
                  icon='envelope-open-dollar'
                  title='Give'
                  onPress={() => Linking.canOpenURL(givingUrl).then(supported => {
                    if (supported) {
                      Linking.openURL(givingUrl)
                    } else {
                      console.log(`Don't know how to open URI: ${givingUrl}`)
                    }
                  })}
                />
              </TableView>

              <TableView title='Our Church' padded>
                <Cell
                  title='About Christ Fellowship'
                  onPress={() => openUrl('https://beta.christfellowship.church/about')}
                />
                <Cell
                  title='Church Locations'
                  onPress={() => openUrl('https://beta.christfellowship.church/locations')}
                />
                <Cell
                  title='Contact Us'
                  onPress={() => openUrl('https://gochristfellowship.com/new-here/contact-us')}
                />
              </TableView>
            </ScrollView>
          )}
        </WebBrowserConsumer>
      </SafeAreaView>
    </BackgroundView>
  )

More.navigationOptions = {
  title: 'More',
  header: null,
}

More.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
    navigate: PropTypes.func,
  }),
  givingUrl: PropTypes.string
}

More.defaultProps = {
  givingUrl: 'https://pushpay.com/g/christfellowship'
}

export default More
