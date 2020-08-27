import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import { SafeAreaView } from 'react-navigation';

import {
    ErrorCard,
    H4,
    BackgroundView,
    PaddedView,
} from '@apollosproject/ui-kit';

import NavigationHeader from '../content-single/NavigationHeader';
import GET_PRAYER_REQUEST from './getPrayerRequest';

const PrayerRequestSingle = ({ navigation }) => {
    const prayerRequestId = navigation.getParam('prayerRequestId', null);
    const { loading, error, data } = useQuery(GET_PRAYER_REQUEST, {
        fetchPolicy: 'cache-and-network',
        skip: !prayerRequestId,
        variables: {
            prayerRequestId,
        },
    });

    if (error) return <ErrorCard error={error} />;

    const prayer = get(data, 'node', {});

    return (
        <BackgroundView>
            <SafeAreaView forceInset={{ top: 'always', bottom: 'always' }}>
                <PaddedView>
                    <H4 isLoading={loading}>{get(prayer, 'text', '')}</H4>
                </PaddedView>
            </SafeAreaView>
        </BackgroundView>
    );
};

PrayerRequestSingle.propTypes = {};

PrayerRequestSingle.navigationOptions = {
    header: NavigationHeader,
    headerTransparent: true,
    headerMode: 'float',
};

export default PrayerRequestSingle;
