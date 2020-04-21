import React from 'react';
import { createStackNavigator } from 'react-navigation';

import { useCurrentUser } from '../hooks';
import NavigationHeader from '../content-single/NavigationHeader';
import EditUser from './EditUser';

const EditCurrentUser = ({ navigation }) => {
    const { updateProfile, ...props } = useCurrentUser({
        onUpdate: () => navigation.goBack(null),
    });
    const formatValuesForUpdate = ({
        birthDate,
        gender,
        street1,
        city,
        state,
        postalCode,
        allowSMS,
        allowEmail,
        phoneNumber,
        email,
    }) => {
        const communicationPreferences = [];

        if (phoneNumber && phoneNumber !== '')
            communicationPreferences.push({ type: 'SMS', allow: allowSMS });

        if (email && email !== '')
            communicationPreferences.push({ type: 'Email', allow: allowEmail });

        updateProfile({
            variables: {
                profileFields: [
                    { field: 'BirthDate', value: birthDate },
                    { field: 'Gender', value: gender },
                ],
                address: {
                    street1: street1 || '',
                    city: city || '',
                    state: state || '',
                    postalCode: postalCode || '',
                },
                communicationPreferences,
            },
        });
    };

    return (
        <EditUser
            {...props}
            updateProfile={formatValuesForUpdate}
            navigation={navigation}
        />
    );
};

EditCurrentUser.navigationOptions = {
    headerMode: 'float',
    headerTransparent: true,
    header: NavigationHeader,
};

const EditUserNavigator = createStackNavigator(
    {
        EditCurrentUser,
    },
    {
        initialRouteName: 'EditCurrentUser',
        headerMode: 'float',
        headerTransitionPreset: 'fade-in-place',
        navigationOptions: {
            header: null,
        },
    }
);

export default EditUserNavigator;
