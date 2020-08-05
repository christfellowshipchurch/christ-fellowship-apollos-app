import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import Color from 'color';

import {
    styled,
    withTheme,
    UIText,
    Icon,
    TouchableScale,
    InlineActivityIndicator,
} from '@apollosproject/ui-kit';
import AwesomeAlert from 'react-native-awesome-alerts';
import BlurView from 'ui/BlurView';

const CHECK_IN = gql`
  mutation checkInUser($id: ID!) {
    checkInCurrentUser(id: $id) {
      id
      title
      message
      isCheckedIn
    }
  }
`;

const GET_CHECK_IN = gql`
  query getCheckIn($itemId: ID!) {
    node(id: $itemId) {
      __typename
      id
      ... on EventContentItem {
        checkin {
          id
          title
          message
          isCheckedIn
        }
      }
    }
  }
`;

const StyledBlurView = styled(({ theme }) => ({
    paddingHorizontal: theme.sizing.baseUnit,
    paddingVertical: theme.sizing.baseUnit * 0.75,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
}))(BlurView);

const StyledButton = styled(({ theme, disabled, isLoading, isCheckedIn }) => {
    let backgroundColor = theme.colors.primary;

    if (isLoading || disabled)
        backgroundColor = Color(theme.colors.primary)
            .mix(Color(theme.colors.background.screen))
            .hex();

    if (isCheckedIn)
        backgroundColor = Color(theme.colors.success)
            .mix(Color(theme.colors.background.screen))
            .hex();

    return {
        paddingVertical: theme.sizing.baseUnit * 0.25,
        paddingHorizontal: theme.sizing.baseUnit * 0.5,
        marginLeft: 5,
        backgroundColor,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: theme.sizing.baseBorderRadius,
        ...(isLoading ? { width: 75, justifyContent: 'center' } : {}),
    };
})(View);

const ButtonTitle = styled(({ theme }) => ({
    fontSize: 12,
    color: theme.colors.background.screen,
    paddingHorizontal: theme.sizing.baseUnit * 0.25,
}))(UIText);

const ButtonIcon = withTheme(({ theme }) => ({
    size: 16,
    fill: theme.colors.background.screen,
    style: { paddingHorizontal: theme.sizing.baseUnit * 0.25 },
}))(Icon);

const Message = withTheme(({ theme }) => ({
    bold: true,
    style: { paddingHorizontal: theme.sizing.baseUnit * 0.25 },
}))(UIText);

const StyledActivityIndicator = withTheme(({ theme }) => ({
    color: theme.colors.background.screen,
}))(InlineActivityIndicator);

const ConfirmationAlert = withTheme(({ theme }) => ({
    titleStyle: {
        color: theme.colors.success,
        fontSize: theme.helpers.rem(1.5),
        lineHeight: theme.helpers.verticalRhythm(1.5, 1.15),
        fontFamily: theme.typography.sans.black.default,
        fontWeight: '900',
        textAlign: 'center',
    },
    messageStyle: {
        color: theme.colors.text.secondary,
        fontWeight: '700',
    },
    contentContainerStyle: {
        backgroundColor: theme.colors.background.screen,
    },
}))(AwesomeAlert);

export const CheckInButton = ({
    title,
    icon,
    onPress,
    message,
    isLoading,
    disabled,
    isCheckedIn,
    style,
}) => {
    const shouldDisable = isLoading || disabled || isCheckedIn || false;
    const WrappingComponent = shouldDisable ? View : TouchableScale;

    return (
        <StyledBlurView blurType="material" style={style}>
            <View style={{ flex: 2, paddingRight: 2 }}>
                <Message bold>{message}</Message>
            </View>
            <View style={{ flex: 1, paddingLeft: 2, alignItems: 'flex-end' }}>
                <WrappingComponent onPress={!isLoading && !disabled && onPress}>
                    <StyledButton
                        pill={false}
                        disabled={shouldDisable}
                        isLoading={isLoading}
                        isCheckedIn={isCheckedIn}
                    >
                        {isLoading ? (
                            <StyledActivityIndicator />
                        ) : (
                                <>
                                    <ButtonIcon name={icon} />
                                    <ButtonTitle bold>{title}</ButtonTitle>
                                </>
                            )}
                    </StyledButton>
                </WrappingComponent>
            </View>
        </StyledBlurView>
    );
};

CheckInButton.propTypes = {
    title: PropTypes.string,
    message: PropTypes.string,
    icon: PropTypes.string,
    onPress: PropTypes.func,
    isLoading: PropTypes.bool,
    disabled: PropTypes.bool,
    isCheckedIn: PropTypes.bool,
    style: PropTypes.object,
};

CheckInButton.defaultProps = {
    title: 'Check In',
    message: "Let us know you're here!",
    icon: 'check',
    onPress: () => null,
    isLoading: false,
    disabled: false,
    isCheckedIn: false,
    style: {},
};

const CheckInButtonConnected = ({ contentId, isLoading, style }) => {
    const [showAlert, setShowAlert] = useState(false);
    const [doCheckIn, { loading: mutationLoading }] = useMutation(CHECK_IN, {
        update: async (cache, { data }) => {
            const queryData = await cache.readQuery({
                query: GET_CHECK_IN,
                variables: {
                    itemId: contentId,
                },
            });

            setShowAlert(true);

            cache.writeQuery({
                query: GET_CHECK_IN,
                data: {
                    ...queryData,
                    node: {
                        ...queryData.node,
                        checkin: data.checkInCurrentUser,
                    },
                },
            });
        },
    });
    const { loading, error, data } = useQuery(GET_CHECK_IN, {
        fetchPolicy: 'network-only',
        skip: !contentId || contentId === '' || isLoading,
        variables: {
            itemId: contentId,
            key: 'CHECK_IN',
        },
    });

    const checkin = get(data, 'node.checkin', null);

    const showConfirmationMessage = () => {
        if (showAlert) setTimeout(() => setShowAlert(false), 2000);
    };
    useEffect(() => showConfirmationMessage(), [showAlert]);

    // If any error is thrown, we should just not show any ui
    if (error || !checkin || loading) return null;

    return (
        <>
            <CheckInButton
                {...checkin}
                isLoading={mutationLoading}
                style={style}
                onPress={() => doCheckIn({ variables: { id: checkin.id } })}
            />
            <ConfirmationAlert
                show={showAlert}
                showProgress={false}
                title="You're all set!"
                message="Thanks for checking in."
                closeOnTouchOutside={false}
                closeOnHardwareBackPress={false}
            />
        </>
    );
};

CheckInButtonConnected.propTypes = {
    contentId: PropTypes.string,
    isLoading: PropTypes.bool,
    style: PropTypes.object,
};

CheckInButtonConnected.defaultProps = {
    contentId: '',
    isLoading: false,
    style: {},
};

export default CheckInButtonConnected;
