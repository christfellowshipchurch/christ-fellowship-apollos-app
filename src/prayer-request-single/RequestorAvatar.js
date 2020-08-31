import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { useQuery } from '@apollo/react-hooks';
import {
    Avatar,
    ConnectedImage,
    withTheme,
    styled,
    H4,
} from '@apollosproject/ui-kit';

import { useCurrentUser } from 'hooks';
import BlurView from 'ui/BlurView';

import GET_PRAYER_REQUEST from './getPrayerRequest';

const StyledBlurView = withTheme(({ theme }) => ({
    reducedTransparencyFallbackColor: theme.colors.background.paper,
    style: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
}))(BlurView);

const AvatarContainer = styled(() => ({
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
}))(View);

const RequestorAvatar = ({
    prayerRequestId,
    isLoading,
    myPrayerText,
    StretchyComponent,
}) => {
    const { id } = useCurrentUser();
    const { loading, error, data } = useQuery(GET_PRAYER_REQUEST, {
        fetchPolicy: 'cache-and-network',
        skip: !prayerRequestId,
        variables: {
            prayerRequestId,
        },
    });

    const avatar = get(data, 'node.requestor.photo', []);
    const title =
        get(data, 'node.requestor.id') === id
            ? myPrayerText
            : `${get(data, 'node.requestor.firstName')}'s Prayer Request`;

    return (
        <View>
            <StretchyComponent>
                <ConnectedImage
                    isLoading={!avatar.length && (loading || isLoading)}
                    source={avatar}
                    // Sets the ratio of the image
                    minAspectRatio={1}
                    maxAspectRatio={1}
                    // Sets the ratio of the placeholder
                    forceRatio={1}
                    // No ratios are respected without this
                    maintainAspectRatio
                />

                <StyledBlurView blurType="chromeMaterial" blurAmount={10} />
            </StretchyComponent>

            <AvatarContainer>
                <Avatar
                    isLoading={!avatar.length && (loading || isLoading)}
                    source={avatar}
                    size="large"
                />
                {!(loading || isLoading) && <H4 padded>{title}</H4>}
            </AvatarContainer>
        </View>
    );
};

RequestorAvatar.propTypes = {
    prayerRequestId: PropTypes.string,
    isLoading: PropTypes.bool,
    myPrayerText: PropTypes.string,
    StretchyComponent: PropTypes.oneOfType([PropTypes.func]),
};

RequestorAvatar.defaultProps = {
    myPrayerText: 'My Prayer Request',
    StretchyComponent: View,
};

export default RequestorAvatar;
