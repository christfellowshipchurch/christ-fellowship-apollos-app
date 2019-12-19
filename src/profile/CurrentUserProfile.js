import React from 'react';
import { useQuery, useMutation } from 'react-apollo';
import { withNavigation } from 'react-navigation';
import { get } from 'lodash';
import moment from 'moment';

import { ActivityIndicator } from '@apollosproject/ui-kit';

import UserProfile from './UserProfile';

import { CURRENT_USER } from './queries';
import { UPDATE_CURRENT_USER } from './mutations';

const CurrentUserProfile = ({ navigation }) => {
    const {
        loading,
        error,
        refetch,
        data: { currentUser: { profile } = {}, getStatesList } = {},
    } = useQuery(CURRENT_USER, { fetchPolicy: 'cache-and-network' });

    if (loading) return <ActivityIndicator />;
    if (error) return null;

    const address = [
        get(profile, 'address.street1', ''),
        get(profile, 'address.street2', ''),
        `${get(profile, 'address.city', '')}, ${get(
            profile,
            'address.state',
            ''
        )} ${get(profile, 'address.postalCode', '').substring(0, 5)}`,
    ];

    const profileFields = [
        { title: 'Home Address', content: address },
        {
            title: 'Birthday',
            content: moment(profile.birthDate).format('MMM D, YYYY'),
        },
        { title: 'Gender', content: profile.gender },
    ];

    return (
        <UserProfile
            {...profile}
            fields={profileFields}
            onSave={(fields) => {
                // updateProfile()
            }}
            onEdit={() => navigation.navigate('EditCurrentUserProfile')}
            states={get(getStatesList, 'values', [])}
        />
    );
};

export default withNavigation(CurrentUserProfile);
