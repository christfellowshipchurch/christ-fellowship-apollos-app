/**
 * CoreApollosProviders.js
 *
 * Author: Caleb Panza
 * Created: Apr 02, 2021
 *
 * Renders the Apollos Project Providers with consideration for automatic theme switching between light and dark mode.
 *
 * todo : remove this file once the Core Theme Provider supports automatic appearance switching out of the box
 */

import React from 'react';
import { useColorScheme } from 'react-native-appearance';
import { Appearance } from 'react-native';

import { Providers } from '@apollosproject/ui-kit';
import customTheme, { customIcons } from '../theme';

const CoreApollosProviders = (props) => {
  /**
   * note : In order to make sure that we don't accidentally set our base theme to an invalid value, we'll just check to make sure that we have either `light` or `dark` as the current scheme
   *
   * todo : dynamically switch between current themes. Currently disabled due to rendering limitations with React Pure Component and the Apollos Theme
   */
  // const scheme = useColorScheme();
  const scheme = Appearance.getColorScheme();
  const safeTheme = scheme === 'light' || scheme === 'dark' ? scheme : 'light';

  return (
    <Providers
      themeInput={{ ...customTheme, type: safeTheme }}
      iconInput={customIcons}
      {...props}
    />
  );
};

CoreApollosProviders.propTypes = {};
CoreApollosProviders.defaultProps = {};

export default CoreApollosProviders;
