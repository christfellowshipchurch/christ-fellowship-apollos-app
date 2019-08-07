import React, { PureComponent } from 'react'
import { View, ImageBackground, ScrollView } from 'react-native'
import { StackActions, NavigationActions } from 'react-navigation'

import PropTypes from 'prop-types'
import { Query, Mutation } from 'react-apollo'
import { compose } from 'recompose'

import {
  BackgroundView,
  PaddedView,
  TableView,
  FlexedView,
  Cell,
  CellIcon,
  CellText,
  Divider,
  Touchable,
  styled,
  withTheme,
  ActivityIndicator,
  Icon,
  H4
} from '@apollosproject/ui-kit';
import { WebBrowserConsumer } from 'ChristFellowship/src/ui/WebBrowser';
import AvatarForm from 'ChristFellowship/src/ui/UserAvatarView/AvatarForm';

import { GET_LOGIN_STATE, LOGOUT } from '@apollosproject/ui-auth'

const StyledScrollView = styled(({ theme }) => ({
  backgroundColor: theme.colors.paper,
}))(ScrollView)

const Container = styled(({ theme }) => ({
  alignItems: 'center',
  flexDirection: 'row',
}))(ImageBackground)

const NavigationHeader = styled(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  paddingBottom: theme.sizing.baseUnit
}))(FlexedView)

const PaddedFlexedView = styled(({ theme }) => ({
  paddingVertical: theme.sizing.baseUnit * 4,
}))(FlexedView)

const BackIconContainer = styled(({ theme }) => ({
  paddingVertical: theme.sizing.baseUnit,
  paddingHorizontal: theme.sizing.baseUnit * 1.5,
}))(Touchable)

const BackIcon = compose(
  withTheme(({ theme }) => ({
    name: 'arrowBack',
    fill: theme.colors.white,
  }))
)(Icon)

const DarkOverlay = styled(({ theme }) => ({
  backgroundColor: 'rgba(0, 0, 0, .55)',
  position: 'absolute',
  height: '100%',
  width: '100%'
}))(View)

const AvatarView = styled({
  alignItems: 'center',
  justifyContent: 'center',
})(PaddedView)

const RowHeader = styled(({ theme }) => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingVertical: theme.sizing.baseUnit,
}))(PaddedView)

const Name = styled({
  flexGrow: 1,
})(View)

const UserSettings = ({
  navigation
}) => (
    <Query query={GET_LOGIN_STATE} fetchPolicy="cache-and-network">
      {({ data: { isLoggedIn = false, loading } }) => {
        if (loading) return <ActivityIndicator />
        if (!isLoggedIn) return null

        return (
          <View>
            <Container source={{ uri: 'https://picsum.photos/375/812/?random' }}>
              <DarkOverlay />
              <PaddedFlexedView>
                <NavigationHeader>
                  <BackIconContainer onPress={() => navigation.goBack()}>
                    <BackIcon />
                  </BackIconContainer>
                </NavigationHeader>

                <AvatarView>
                  <AvatarForm text />
                </AvatarView>
              </PaddedFlexedView>
            </Container>
            <StyledScrollView>
              <WebBrowserConsumer>
                {(openUrl) => (
                  <View>
                    <RowHeader>
                      <Name>
                        <H4>{'My Home Campus'}</H4>
                      </Name>
                    </RowHeader>
                    <TableView>
                      <Touchable
                        onPress={() => openUrl('https://apollosrock.newspring.cc/page/235')}
                      >
                        <Cell>
                          <CellIcon name="check" />
                          <CellText>Find a serving opportunity</CellText>
                        </Cell>
                      </Touchable>
                      <Divider />
                      <Touchable
                        onPress={() => openUrl('https://apollosrock.newspring.cc/page/236')}
                      >
                        <Cell>
                          <CellIcon name="groups" />
                          <CellText>Join a small group</CellText>
                        </Cell>
                      </Touchable>
                      <Divider />
                      <Touchable
                        onPress={() => openUrl('https://apollosrock.newspring.cc/page/233')}
                      >
                        <Cell>
                          <CellIcon name="share" />
                          <CellText>I need prayer</CellText>
                        </Cell>
                      </Touchable>
                      <Divider />
                      <Touchable
                        onPress={() => openUrl('https://apollosrock.newspring.cc/page/186')}
                      >
                        <Cell>
                          <CellIcon name="download" />
                          <CellText>I would like to give</CellText>
                        </Cell>
                      </Touchable>
                    </TableView>
                    <TableView>
                      <Touchable
                        onPress={() => NavigationActions.navigate('TestingControlPanel')}
                      >
                        <Cell>
                          <CellIcon name="settings" />
                          <CellText>Open Testing Panel</CellText>
                        </Cell>
                      </Touchable>
                    </TableView>
                  </View>
                )}
              </WebBrowserConsumer>
            </StyledScrollView>
          </View>
        )
      }}
    </Query>
  )

export default UserSettings
