import React from 'react';
import { useQuery } from 'react-apollo';
import { withNavigation } from 'react-navigation';
import { get } from 'lodash';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import {
    BackgroundView,
    ActivityIndicator,
    Touchable,
    styled,
} from '@apollosproject/ui-kit';

import UserProfile from './UserProfile';

import { CURRENT_USER } from './queries';

const HeaderTouchable = styled(({ theme, withTransparency }) => ({
    marginHorizontal: theme.sizing.baseUnit,
    opacity: withTransparency ? 0.5 : 1,
}))(Touchable);

const CurrentUserProfile = ({ navigation }) => {
    const {
        loading,
        error,
        refetch,
        data: { currentUser: { profile } = {}, getStatesList } = {},
    } = useQuery(CURRENT_USER, { fetchPolicy: 'cache-and-network' });

    if (loading)
        return (
            <BackgroundView>
                <ActivityIndicator />
            </BackgroundView>
        );
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
            onEdit={() => navigation.navigate('EditCurrentUserProfile')}
            states={get(getStatesList, 'values', [])}
        />
    );
};

CurrentUserProfile.navigationOptions = ({ navigation }) => ({
    headerTransparent: true,
    headerLeft: (
        <HeaderTouchable onPress={() => navigation.navigate('Settings')}>
            <FontAwesomeIcon icon={['fal', 'cog']} fill={'white'} size={24} />
        </HeaderTouchable>
    ),
    headerRight: (
        <HeaderTouchable
            onPress={() => navigation.goBack(null)}
            disabled={navigation.getParam('isLoading')}
            withTransparency
        >
            <FontAwesomeIcon icon={['fal', 'times']} fill={'white'} size={24} />
        </HeaderTouchable>
    ),
});

export default withNavigation(CurrentUserProfile);
