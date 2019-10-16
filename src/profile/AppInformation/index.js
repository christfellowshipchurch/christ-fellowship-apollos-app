import React from 'react'
import { View, Text } from 'react-native'
import {
    PaddedView,
    Touchable,
    styled,
    H3
} from '@apollosproject/ui-kit'

import UserAvatarHeader from 'ChristFellowship/src/ui/UserAvatarHeader'
import { TableView, Cell } from 'ChristFellowship/src/ui/TableView'

const AppInfoContainer = styled(({ theme }) => ({
    paddingVertical: theme.sizing.baseUnit,
}))(View)

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
            <TableView>
                <Cell
                    title='Why do you want my info?'
                    icon='question-circle'
                    onPress={() => navigation.navigate('ValueProp')} />

                <Cell
                    title='Privacy Policy'
                    icon='info-circle'
                    onPress={() => navigation.navigate('PrivacyPolicy')} />
                <Cell
                    title='Terms of Service'
                    icon='info-circle'
                    onPress={() => navigation.navigate('TermsOfUse')} />
                <Cell title='Send Us Feedback' icon='external-link-square' />
            </TableView>
        </UserAvatarHeader>
    )

export default AppInfo
