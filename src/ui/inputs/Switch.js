import React from 'react';
import PropTypes from 'prop-types';
import { compose, withProps, pure } from 'recompose';

import { withTheme, Switch as CoreSwitch } from '@apollosproject/ui-kit';
import { InputIcon } from './styles';

const enhance = compose(
  withTheme(),
  pure,
  withProps(({ ...props }) => ({
    ...props,
  }))
);

const Switch = enhance(({ icon, hideIcon, theme, disabled, ...props }) => (
  <CoreSwitch
    prefix={
      icon && <InputIcon icon={icon} disbled={disabled} hideIcon={hideIcon} />
    }
    {...props}
  />
));

Switch.propTypes = {
  icon: PropTypes.string,
  disabled: PropTypes.bool,
};

Switch.defaultProps = {
  icon: null,
  disabled: false,
};

export default Switch;
