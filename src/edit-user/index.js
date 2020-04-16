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
    }) => {
        updateProfile({
            variables: {
                profileFields: [
                    { field: 'BirthDate', value: birthDate },
                    { field: 'Gender', value: gender },
                ],
                address: {
                    street1,
                    city,
                    state,
                    postalCode,
                },
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
