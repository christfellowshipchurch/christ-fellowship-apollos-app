import React from 'react'
import { View, Text } from 'react-native'
import {
    PaddedView,
    TableView,
    Cell,
    CellIcon,
    CellText,
    Divider,
    Touchable,
    styled,
    H3
} from '@apollosproject/ui-kit'

import UserAvatarHeader from 'ChristFellowship/src/ui/UserAvatarHeader'

const RowHeader = styled(({ theme }) => ({
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.sizing.baseUnit,
}))(PaddedView)

const AppInfoContainer = styled(({ theme }) => ({
    paddingVertical: theme.sizing.baseUnit,
}))(View)

const Name = styled({
    flexGrow: 1,
})(View)

const RowLink = ({ title, icon, onPress }) => (
    <React.Fragment>
        <Touchable
            onPress={onPress}
        >
            <Cell>
                <CellIcon name={icon} />
                <CellText>{title}</CellText>
                <CellIcon name={'arrow-next'} />
            </Cell>
        </Touchable>
        <Divider />
    </React.Fragment>
)

const AppInfo = ({
    navigation,
    appInfoRowTitle = 'App Information'
}) => (
        <UserAvatarHeader
            navigation={navigation}
            minimize
            withGoBack >
            <AppInfoContainer>
                <RowHeader>
                    <H3>
                        {appInfoRowTitle}
                    </H3>
                </RowHeader>
                <TableView>
                    <RowLink title='Why do you want my info?' icon='warning' />
                    <RowLink title='Privacy Policy' icon='information' />
                    <RowLink title='Terms of Service' icon='information' />
                    <RowLink title='Send Us Feedback' icon='text' />
                </TableView>

                <View style={{ height: 1000 }}>
                    <RowHeader>
                        <Name>
                            <Text>Scroll up and down to see the Profile resize in real time</Text>
                        </Name>
                    </RowHeader>
                </View>
            </AppInfoContainer>
        </UserAvatarHeader>
    )

export default AppInfo
