import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { isArray } from 'lodash';
import moment from 'moment';
import { useNotificationHistory } from 'hooks';
import NavigationHeader from '../content-single/NavigationHeader';
import NotificationList from './NotificationList';

const NotificationCenter = () => {
    const { notifications } = useNotificationHistory();

    return <NotificationList notifications={notifications} />;
};

NotificationCenter.navigationOptions = {
    header: NavigationHeader,
    headerTransparent: true,
    headerMode: 'float',
};

export default NotificationCenter;
