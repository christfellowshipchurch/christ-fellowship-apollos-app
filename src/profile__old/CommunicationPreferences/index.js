import React from 'react'
import { View } from 'react-native'
import {
    styled,
} from '@apollosproject/ui-kit'

import UserAvatarHeader from 'ChristFellowship/src/ui/UserAvatarHeader'
import PhoneNumberForm from './PhoneNumberForm'
import EmailForm from './EmailForm'
import PushNotifications from './PushNotifications'

const Container = styled(({ theme }) => ({
    paddingVertical: theme.sizing.baseUnit,
}))(View)

const CommunciationsPreferences = ({
    navigation,
    phoneNumberRowTitle = 'Phone Number',
    emailRowTitle = 'Email Address',
    pushNotificationsRowTitle = 'Enable Push Notifications'
}) => (
        <UserAvatarHeader
            navigation={navigation}
            minimize
            withGoBack >
            {({ email, phoneNumber, communicationPreferences }) => {
                return (
                    <Container>
                        <PushNotifications title={pushNotificationsRowTitle} />

                        <PhoneNumberForm title={phoneNumberRowTitle} initialValues={{ phoneNumber, ...communicationPreferences }} />

                        <EmailForm title={emailRowTitle} initialValues={{ email, ...communicationPreferences }} />
                    </Container>
                )
            }}
        </UserAvatarHeader>
    )

export default CommunciationsPreferences
