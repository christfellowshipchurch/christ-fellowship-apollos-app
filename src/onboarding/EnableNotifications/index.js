import React from 'react'
import { NavigationActions } from 'react-navigation'
import Form from './form'
import PushNotification from 'react-native-push-notification'

const navigateToTabs = (navigation) => navigation.navigate('Tabs', { header: null })

const handleSubmit = ({ navigation }) => {
    PushNotification.requestPermissions()
    navigateToTabs(navigation)
}

const handleSkip = ({ navigation }) => navigateToTabs(navigation)

const EnableNotifications = (props) => (
    <Form {...props}
        handleSubmit={() => handleSubmit(props)}
        handleSkip={() => handleSkip(props)} />
)

EnableNotifications.navigationOptions = {
    header: null,
    gesturesEnabled: false
}

export default EnableNotifications;
