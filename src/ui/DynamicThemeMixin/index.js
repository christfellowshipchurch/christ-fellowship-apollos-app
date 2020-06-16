import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { ThemeMixin } from '@apollosproject/ui-kit';
import { DynamicValue, useDynamicValue } from 'react-native-dark-mode';

const dynamicTheme = new DynamicValue('light', 'dark');

const DynamicThemeMixin = ({ children, theme }) => {
  const defaultTheme = useDynamicValue(dynamicTheme);

  return (
    <ThemeMixin
      mixin={{
        type: get(theme, 'type', defaultTheme).toLowerCase(),
        colors: get(theme, 'colors'),
      }}
    >
      {children}
    </ThemeMixin>
  );
};

DynamicThemeMixin.propTypes = {
  theme: PropTypes.string,
};

export default DynamicThemeMixin;
