import React from 'react';
import { View } from 'react-native';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import Color from 'color';

import {
  styled,
  withTheme,
  BodyText,
  UIText,
  Icon,
  TouchableScale,
  InlineActivityIndicator,
} from '@apollosproject/ui-kit';
import BlurView from 'ui/BlurView';

const GET_CHECK_IN = gql`
  query getCheckIn {
    checkin {
      id
      title
      message
    }
  }
`;

const StyledBlurView = styled(({ theme }) => ({
  margin: theme.sizing.baseUnit,
  paddingHorizontal: theme.sizing.baseUnit * 0.5,
  paddingVertical: theme.sizing.baseUnit * 0.75,
  borderRadius: theme.sizing.baseBorderRadius,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
}))(BlurView);

const StyledButton = styled(({ theme, disabled, isLoading }) => ({
  paddingVertical: theme.sizing.baseUnit * 0.25,
  paddingHorizontal: theme.sizing.baseUnit * 0.5,
  marginLeft: 5,
  backgroundColor:
    disabled || isLoading
      ? Color(theme.colors.primary)
          .mix(Color(theme.colors.background.screen))
          .hex()
      : theme.colors.primary,
  flexDirection: 'row',
  alignItems: 'center',
  borderRadius: theme.sizing.baseBorderRadius,
  ...(isLoading ? { width: 75, justifyContent: 'center' } : {}),
}))(View);

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

export const CheckInButton = ({
  title,
  icon,
  onPress,
  message,
  isLoading,
  disabled,
}) => {
  const WrappingComponent = isLoading || disabled ? View : TouchableScale;
  return (
    <StyledBlurView blurType="material">
      <View style={{ flex: 2, paddingRight: 2 }}>
        <Message bold>{message}</Message>
      </View>
      <View style={{ flex: 1, paddingLeft: 2, alignItems: 'flex-end' }}>
        <WrappingComponent onPress={!isLoading && !disabled && onPress}>
          <StyledButton pill={false} disabled={disabled} isLoading={isLoading}>
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
};

CheckInButton.defaultProps = {
  title: 'Check In',
  message: "Let us know you're here!",
  icon: 'check',
  onPress: () => null,
  isLoading: false,
  disabled: false,
};

const CheckInButtonConnected = ({ contentId, isLoading }) => {
  const { loading, error, data } = useQuery(GET_CHECK_IN, {
    skip: !contentId || contentId === '' || isLoading,
  });

  // If any error is thrown, we should just not show any ui
  if (error) return null;

  const checkin = get(data, 'checkin', {});

  return <CheckInButton isLoading={loading} {...checkin} />;
};

export default CheckInButtonConnected;
