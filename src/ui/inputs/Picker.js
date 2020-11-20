import React from 'react';
import { View, Platform } from 'react-native';
import PropTypes from 'prop-types';
import {
  Picker as CorePicker,
  PickerItem as CorePickerItem,
  styled,
  withTheme,
} from '@apollosproject/ui-kit';

import { InputIcon } from './styles';

export const PickerItem = withTheme(({ theme }) => ({
  color: theme.colors.text.primary,
  backgroundColor: theme.colors.background.paper,
  ...Platform.select({
    android: {
      fontFamily: theme.typography.sans.bold.default,
    },
  }),
}))(CorePickerItem);

const Row = styled(({ theme }) => ({
  flexDirection: 'row',
  flex: 1,
  alignItems: 'center',
}))(View);

const StyledPicker = styled(({ theme }) => ({
  paddingTop: theme.sizing.baseUnit * 0.5,
  color: theme.colors.text.primary,
  ...Platform.select({
    android: {
      fontFamily: theme.typography.sans.bold.default,
    },
  }),
}))(CorePicker);

const Picker = ({ value, icon, hideIcon, ...pickerProps }) => (
  <Row>
    <InputIcon icon={icon} hideIcon={hideIcon} />
    <StyledPicker {...pickerProps} value={value} wrapperStyle={{ flex: 1 }} />
  </Row>
);

Picker.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  icon: PropTypes.string,
  hideIcon: PropTypes.bool,
};

Picker.defaultProps = {
  hideIcon: false,
  icon: 'text',
};

export default Picker;
