import React from 'react'
import { View, Text } from 'react-native'
import {
    PaddedView,
    TableView,
    styled,
    H3
} from '@apollosproject/ui-kit'

import UserAvatarHeader from 'ChristFellowship/src/ui/UserAvatarHeader'
import PhoneNumberForm from './PhoneNumberForm'
import EmailForm from './EmailForm'

const RowHeader = styled(({ theme }) => ({
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.sizing.baseUnit,
}))(PaddedView)

const Container = styled(({ theme }) => ({
    paddingVertical: theme.sizing.baseUnit,
}))(View)

const CommunciationsPreferences = ({
    navigation,
    phoneNumberRowTitle = 'Phone Number',
    emailRowTitle = 'Email Address',
}) => (
        <UserAvatarHeader
            navigation={navigation}
            minimize
            withGoBack >
            {({ email, phoneNumber, communicationPreferences }) => {
                return (
                    <Container>
                        <RowHeader>
                            <H3>{phoneNumberRowTitle}</H3>
                        </RowHeader>
                        <TableView>
                            <PhoneNumberForm initialValues={{ phoneNumber, ...communicationPreferences }} />
                        </TableView>

                        <RowHeader>
                            <H3>{emailRowTitle}</H3>
                        </RowHeader>
                        <TableView>
                            <EmailForm initialValues={{ email, ...communicationPreferences }} />
                        </TableView>
                    </Container>
                )
            }}
        </UserAvatarHeader>
    )

export default CommunciationsPreferences
