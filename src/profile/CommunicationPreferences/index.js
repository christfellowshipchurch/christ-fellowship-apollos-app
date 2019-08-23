import React from 'react'
import { View } from 'react-native'
import {
    styled,
} from '@apollosproject/ui-kit'

import UserAvatarHeader from 'ChristFellowship/src/ui/UserAvatarHeader'
import PhoneNumberForm from './PhoneNumberForm'
import EmailForm from './EmailForm'

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
                        <PhoneNumberForm title={phoneNumberRowTitle} initialValues={{ phoneNumber, ...communicationPreferences }} />

                        <EmailForm title={emailRowTitle} initialValues={{ email, ...communicationPreferences }} />
                    </Container>
                )
            }}
        </UserAvatarHeader>
    )

export default CommunciationsPreferences
