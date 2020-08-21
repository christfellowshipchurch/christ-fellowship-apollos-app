import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import { isArray, take } from 'lodash';

const NOTIFICATION_KEY = 'notificationHistory';

const sortDateDesc = (a, b) => moment(b.date).diff(moment(a.date));

const useNotificationHistory = () => {
    const [notifications, setNotifications] = useState([]);

    const getLocalHistory = async () => {
        try {
            const currentMessages = await AsyncStorage.getItem(NOTIFICATION_KEY);

            if (currentMessages !== null) {
                const parsedJson = JSON.parse(currentMessages);
                if (isArray(parsedJson)) {
                    return parsedJson.sort(sortDateDesc);
                }
                return [parsedJson];
            }
        } catch (e) {
            return [];
        }

        return [];
    };

    const addNotification = async (notification) => {
        try {
            const currentMessages = await getLocalHistory();
            let saveData = [];

            if (currentMessages.length >= 10) {
                saveData = take(currentMessages.sort(sortDateDesc), 9);

                saveData.push(notification);
            } else {
                saveData = [...currentMessages, notification];
            }

            await AsyncStorage.setItem(
                NOTIFICATION_KEY,
                JSON.stringify(saveData.sort(sortDateDesc))
            );

            setNotifications(saveData.sort(sortDateDesc));
        } catch (e) {
            console.warn(
                'Unable to save incoming Push Notification to Async Storage.'
            );
        }
    };

    useEffect(() => {
        const loadHistory = async () => {
            const n = await getLocalHistory();
            setNotifications(n);
        };

        loadHistory();
    }, []);

    return {
        notifications,
        addNotification,
    };
};

export default useNotificationHistory;
