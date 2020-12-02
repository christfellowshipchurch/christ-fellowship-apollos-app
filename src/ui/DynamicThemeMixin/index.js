import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { ThemeMixin } from '@apollosproject/ui-kit';
import { DynamicValue, useDynamicValue } from 'react-native-dark-mode';

const dynamicTheme = new DynamicValue('light', 'dark');

const DynamicThemeMixin = ({ children, theme }) => {
  const defaultTheme = useDynamicValue(dynamicTheme);
  let mixinType = get(theme, 'type');

  if (
    !mixinType ||
    mixinType === '' ||
    mixinType !== 'LIGHT' ||
    mixinType !== 'DARK' ||
    typeof mixinType !== 'string'
  ) {
    mixinType = defaultTheme;
  }

  return (
    <ThemeMixin
      mixin={{
        type: mixinType.toLowerCase(),
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
