import React from 'react';
import PropTypes from 'prop-types';
import { Animated, View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { get } from 'lodash';
import { useQuery } from '@apollo/react-hooks';
import moment from 'moment';

import { fetchMoreResolver } from '@apollosproject/ui-connected';
import {
    styled,
    H4,
    PaddedView,
    TouchableScale,
    Card,
    CardContent,
} from '@apollosproject/ui-kit';

import { CardFeed } from 'ui/CardFeeds';
import DateLabel from 'ui/DateLabel';
import { HorizontalDivider } from 'ui/Dividers';
import {
    navigationOptions,
    NavigationSpacer,
    useHeaderScrollEffect,
} from 'navigation';
import GET_MY_PRAYER_REQUESTS from './getMyPrayerRequests';

const loadingStateObject = {
    id: 'fake_id',
    text: '',
    date: moment().format(),
};

const StyledHorizontalDivider = styled(({ theme }) => ({
    width: '100%',
    marginVertical: theme.sizing.baseUnit * 0.5,
}))(HorizontalDivider);

const PrayerPreview = ({ text, date, isLoading, asCard }) => {
    const BodyContent = () => (
        <View>
            <DateLabel date={date} isLoading={isLoading} />
            <H4 isLoading={isLoading} numberOfLines={3}>
                {text}
            </H4>
        </View>
    );

    return asCard ? (
        <Card style={{ flex: 1 }}>
            <CardContent>
                <BodyContent />
            </CardContent>
        </Card>
    ) : (
            <View>
                <PaddedView>
                    <BodyContent />
                </PaddedView>
                <StyledHorizontalDivider />
            </View>
        );
};

const mapEdges = (data) =>
    get(data, 'currentUserPrayerRequests.edges', []).map(({ node }) => ({
        ...node,
        date: node.requestedDate,
    }));

const MyPrayerRequestsFeed = ({ navigation }) => {
    const { scrollY } = useHeaderScrollEffect({ navigation });
    const { loading, error, data, refetch, fetchMore, variables } = useQuery(
        GET_MY_PRAYER_REQUESTS,
        {
            fetchPolicy: 'cache-and-network',
            variables: {
                first: 10,
                after: null,
            },
        }
    );

    const prayers = mapEdges(data);
    const renderItem = ({ item, numColumns }) =>
        get(item, 'emptyItem') ? (
            <View {...item} />
        ) : (
                <TouchableScale
                    onPress={() =>
                        navigation.navigate('PrayerRequestSingle', {
                            prayerRequestId: item.id,
                        })
                    }
                    style={{ flex: 1 }}
                >
                    <PrayerPreview {...item} asCard={numColumns > 1} />
                </TouchableScale>
            );

    return (
        <SafeAreaView forceInset style={{ flex: 1 }}>
            <CardFeed
                ListHeaderComponent={<NavigationSpacer />}
                content={prayers.sort((a, b) =>
                    moment(b.requestedDate).diff(a.requestedDate)
                )}
                renderItem={renderItem}
                loadingStateObject={loadingStateObject}
                isLoading={loading}
                error={error}
                fetchMore={fetchMoreResolver({
                    collectionName: 'currentUserPrayerRequests',
                    fetchMore,
                    variables,
                    data,
                })}
                refetch={refetch}
                scrollEventThrottle={16}
                onScroll={Animated.event([
                    {
                        nativeEvent: {
                            contentOffset: { y: scrollY },
                        },
                    },
                ])}
            />
        </SafeAreaView>
    );
};

MyPrayerRequestsFeed.navigationOptions = (props) =>
    navigationOptions({
        ...props,
        title: 'My Prayers',
    });

MyPrayerRequestsFeed.propTypes = {
    navigation: PropTypes.shape({
        getParam: PropTypes.func,
        navigate: PropTypes.func,
    }),
};

export default MyPrayerRequestsFeed;
