import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { useQuery } from '@apollo/react-hooks';
import { get } from 'lodash';

import {
    styled,
    BodyText,
    ConnectedImage,
    HorizontalTileFeed,
    Icon,
    withTheme,
    H4,
    PaddedView,
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

const loadingStateObject = {
    id: 'fake_id',
    firstName: '',
    lastName: '',
    photo: [],
};

const MembersFeedConnected = ({ id }) => {
    const { loading, data, error } = useQuery(GET_MEMBERS, {
        variables: { groupId: id },
        skip: !id || id === '',
        fetchPolicy: 'cache-and-network',
    });

    const renderMember = ({ item, isLoading }) => {
        const photo = get(item, 'photo', {});
        const name = get(item, 'nickName', '') || get(item, 'firstName', '');
        return (
            <MemberCard>
                {!loading && photo && photo.uri ? (
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

    const members = get(data, 'node.members', []);

    if (error && !loading && !members) return null;

    console.log({ members });

    return (
        <View>
            <StyledH4>Members</StyledH4>
            <StyledHorizontalTileFeed
                content={members}
                isLoading={members.length === 0 && loading}
                loadingStateObject={loadingStateObject}
                renderItem={renderMember}
            />
        </View>
    );
};

MembersFeedConnected.propTypes = {
    id: PropTypes.string.isRequired,
};

export default MembersFeedConnected;
