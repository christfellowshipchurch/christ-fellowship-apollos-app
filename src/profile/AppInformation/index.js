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
                    <RowLink
                        title='Why do you want my info?'
                        icon='warning'
                        onPress={() => navigation.navigate('ValueProp')} />

                    <RowLink
                        title='Privacy Policy'
                        icon='information'
                        onPress={() => navigation.navigate('PrivacyPolicy')} />
                    <RowLink
                        title='Terms of Service'
                        icon='information'
                        onPress={() => navigation.navigate('TermsOfUse')} />
                    <RowLink title='Send Us Feedback' icon='text' />
                </TableView>
            </AppInfoContainer>
        </UserAvatarHeader>
    )

export default AppInfo
