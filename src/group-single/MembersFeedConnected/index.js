import React from 'react';
import PropTypes from 'prop-types';
import { View, ActivityIndicator } from 'react-native';
import { useQuery } from '@apollo/react-hooks';
import { get, set, uniqBy } from 'lodash';

import {
    styled,
    BodyText,
    ConnectedImage,
    Icon,
    withTheme,
    H4,
    HorizontalTileFeed,
} from '@apollosproject/ui-kit';

import GET_MEMBERS from './getMembers';

const MemberCard = styled(({ theme }) => ({
    width: 80,
    flex: 1,
    margin: theme.sizing.baseUnit / 2,
    marginBottom: theme.sizing.baseUnit * 0.75,
    alignItems: 'center',
}))(View);

const MemberImage = styled({
    borderRadius: 10,
    width: 80,
    height: 100,
})(ConnectedImage);

const MemberImageWrapper = styled({
    borderRadius: 10,
    width: 80,
    height: 100,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
})(View);

const PlaceholderIcon = withTheme(({ theme: { colors } = {} }) => ({
    fill: colors.paper,
    name: 'avatarPlacholder',
    size: 60,
}))(Icon);

const PlaceholderWrapper = styled(({ theme }) => ({
    borderRadius: 10,
    width: 80,
    height: 100,
    backgroundColor: theme.colors.lightSecondary,
    justifyContent: 'center',
    alignItems: 'center',
}))(View);

const StyledHorizontalTileFeed = withTheme(({ theme }) => ({
    style: {
        marginTop: theme.sizing.baseUnit * -1.25,
        paddingBottom: theme.sizing.baseUnit,
        zIndex: 1,
    },
    snapToInterval: 80 + theme.sizing.baseUnit,
}))(HorizontalTileFeed);

const StyledH4 = styled(({ theme }) => ({
    paddingBottom: theme.sizing.baseUnit,
    paddingHorizontal: theme.sizing.baseUnit,
    paddingTop: theme.sizing.baseUnit * 2,
}))(H4);

const HeaderSpacing = styled(({ theme }) => ({
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
}))(View);

const StyledActivityIndicator = styled(({ theme }) => ({
    paddingHorizontal: theme.sizing.baseUnit,
}))(ActivityIndicator);

const loadingStateObject = {
    id: 'fake_id',
    firstName: '',
    lastName: '',
    photo: [],
};

const mapEdges = (data) =>
    get(data, 'node.people.edges', []).map(({ node }) => ({
        ...node,
    }));

const MembersFeedConnected = ({ id }) => {
    const { loading, error, data, fetchMore, variables } = useQuery(GET_MEMBERS, {
        variables: {
            groupId: id,
            first: 15,
            after: null,
            isLeader: false,
        },
        skip: !id || id === '',
        fetchPolicy: 'cache-and-network',
    });

    const renderMember = ({ item, isLoading }) => {
        const photo = get(item, 'photo', {});
        const name = get(item, 'nickName', '') || get(item, 'firstName', '');
        return (
            <MemberCard>
                {photo && photo.uri ? (
                    <MemberImageWrapper>
                        <MemberImage // eslint-disable-line react-native/no-inline-styles
                            source={photo}
                            minAspectRatio={1}
                            maxAspectRatio={1}
                            // Sets the ratio of the placeholder
                            forceRatio={1}
                            // No ratios are respected without this
                            maintainAspectRatio
                        />
                    </MemberImageWrapper>
                ) : (
                        <PlaceholderWrapper>
                            <PlaceholderIcon isLoading={false} />
                        </PlaceholderWrapper>
                    )}

                <BodyText numberOfLines={1}>{name}</BodyText>
            </MemberCard>
        );
    };

    const members = mapEdges(data);

    if (error && !loading && !members) return null;

    return (
        <View>
            <HeaderSpacing>
                <StyledH4>Members</StyledH4>
                {loading && <StyledActivityIndicator />}
            </HeaderSpacing>
            <StyledHorizontalTileFeed
                data={members}
                isLoading={members.length === 0 && loading}
                loadingStateObject={loadingStateObject}
                renderItem={renderMember}
                onEndReachedThreshold={0.7}
                onEndReached={() => {
                    const pageInfoPath = `node.people.pageInfo`;
                    const edgePath = `node.people.edges`;

                    const after = get(data, `${pageInfoPath}.endCursor`);
                    if (!after) return;

                    fetchMore({
                        variables: { ...variables, after },
                        updateQuery: (previousResult, { fetchMoreResult }) => {
                            const result = fetchMoreResult;
                            const originalPeople = get(previousResult, edgePath, []);
                            const newPeople = get(result, edgePath, []);

                            set(
                                result,
                                edgePath,
                                uniqBy([...originalPeople, ...newPeople], 'node.id')
                            );

                            return result;
                        },
                    });
                }}
            />
        </View>
    );
};

MembersFeedConnected.propTypes = {
    id: PropTypes.string.isRequired,
};

export default MembersFeedConnected;
