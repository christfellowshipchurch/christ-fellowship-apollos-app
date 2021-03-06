import React from 'react';
import { Animated, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { H6, styled } from '@apollosproject/ui-kit';

import FloatingLabel from '@apollosproject/ui-kit/src/inputs/FloatingLabel';
import ErrorText from '@apollosproject/ui-kit/src/inputs/ErrorText';
import InputUnderline from '@apollosproject/ui-kit/src/inputs/InputUnderline';
import InputWrapper from '@apollosproject/ui-kit/src/inputs/InputWrapper';
import withFocusAnimation from '@apollosproject/ui-kit/src/inputs/withFocusAnimation';
import InputAddon, {
  AddonRow,
} from '@apollosproject/ui-kit/src/inputs/InputAddon';
import withInputControlStyles from '@apollosproject/ui-kit/src/inputs/withInputControlStyles';

import { InputIcon } from './styles';

const StyledH6 = withInputControlStyles(H6);
const Placeholder = styled(
  ({ theme }) => ({
    color: theme.colors.text.tertiary,
  }),
  'Inputs.Picker.Placeholder'
)(H6);

const Dropdown = ({
  displayValue,
  focusAnimation, // from createInput
  placeholder,
  label,
  value,
  style,
  onFocus,
  onBlur,
  wrapperStyle,
  focused,
  handleOnPress,
  icon,
  error,
  children,
  hideIcon,
  actionIcon,
}) => {
  const rotate = focusAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });
  const labelAnimation =
    value || !label ? new Animated.Value(1) : focusAnimation;
  const animatedStyle = { opacity: labelAnimation, flex: 1 };

  if (focused) onFocus();
  else onBlur();

  return (
    <InputWrapper style={wrapperStyle}>
      <TouchableOpacity onPress={handleOnPress}>
        <AddonRow>
          <InputAddon>
            <InputIcon focused={focused} icon={icon} hideIcon={hideIcon} />
          </InputAddon>
          <Animated.View style={animatedStyle}>
            <StyledH6 style={{ ...style, paddingTop: 12 }}>
              {displayValue || <Placeholder>{placeholder}</Placeholder>}
            </StyledH6>
            <FloatingLabel animation={labelAnimation}>{label}</FloatingLabel>
          </Animated.View>
          <InputAddon>
            <Animated.View style={{ transform: [{ rotate }] }}>
              <InputIcon focused={focused} icon={actionIcon} />
            </Animated.View>
          </InputAddon>
        </AddonRow>
      </TouchableOpacity>

      {children}

      <InputUnderline animation={focusAnimation} />

      {error && typeof error === 'string' ? (
        <ErrorText>{error}</ErrorText>
      ) : null}
    </InputWrapper>
  );
};

Dropdown.propTypes = {
  placeholder: PropTypes.string,
  displayValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  focusAnimation: PropTypes.any, // eslint-disable-line
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  label: PropTypes.string,
  value: PropTypes.any, // eslint-disable-line
  wrapperStyle: PropTypes.any, // eslint-disable-line
  style: PropTypes.any, // eslint-disable-line
  icon: PropTypes.string,
  actionIcon: PropTypes.string,
  hideIcon: PropTypes.bool,
};

Dropdown.defaultProps = {
  icon: 'text',
  actionIcon: 'arrow-down',
  hideIcon: false,
};

const EnhancedComponent = withFocusAnimation(Dropdown);

export default EnhancedComponent;
