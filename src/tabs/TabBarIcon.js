import React from 'react';
import PropTypes from 'prop-types';

import { Icon, withTheme } from '@apollosproject/ui-kit';

const StyledIcon = withTheme(({ theme, focused }) => ({
  style: { marginBottom: 5 },
  fill: focused ? theme.colors.primary : theme.colors.text.tertiary,
}))(Icon);

const TabBarIcon = ({ name, focused }) => (
  <StyledIcon name={name} focused={focused} size={22} />
);

TabBarIcon.propTypes = {
  name: PropTypes.string,
  focused: PropTypes.bool,
};

export default TabBarIcon;
