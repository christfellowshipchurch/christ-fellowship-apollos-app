import React from 'react'
import Form from './form'
import PushNotification from 'react-native-push-notification'

const handleSubmit = () => {
    console.log("requesting Push Notification permission")
    PushNotification.requestPermissions();
}

const handleSkip = ({ navigation }) => {
    navigation.navigate('Home')
}

const EnableNotifications = (props) => (
    <Form {...props} handleSubmit={handleSubmit} handleSkip={() => handleSkip(props)} />
)

EnableNotifications.displayName = 'EnableNotifications';

export default EnableNotifications;
