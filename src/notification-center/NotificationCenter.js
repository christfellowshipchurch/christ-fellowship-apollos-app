import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import NavigationHeader from '../content-single/NavigationHeader';
import NotificationList from './NotificationList';

const NotificationCenter = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getNotificationsFromLocalStorage = async () => {
            try {
                const value = await AsyncStorage.getItem('notificationHistory');
                if (value !== null) {
                    setNotifications(value);
                }

                setLoading(false);
            } catch (e) {
                setLoading(false);
            }
        };

        getNotificationsFromLocalStorage();
    }, []);

    return <NotificationList notifications={notifications} isLoading={loading} />;
};

NotificationCenter.navigationOptions = {
    header: NavigationHeader,
    headerTransparent: true,
    headerMode: 'float',
};

export default NotificationCenter;
