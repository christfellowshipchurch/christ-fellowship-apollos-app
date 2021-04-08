/**
 * TabHeader.js
 *
 * Author: Caleb Panza
 * Created: Apr 08, 2021
 *
 * Custom Header to be used on all Tabs in the Tab Navigator.
 */

import React from 'react';
import PropTypes from 'prop-types';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View } from 'react-native';
import { styled } from '@apollosproject/ui-kit';

import Wordmark from 'ui/Wordmark';
import HeaderButtons from './HeaderButtons';

// :: Styles
// ====================
const Spacing = styled(({ theme, insets }) => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingTop: theme.sizing.baseUnit + insets.top,
  paddingBottom: theme.sizing.baseUnit,
  paddingHorizontal: theme.sizing.baseUnit,
}))(View);

const TabHeader = ({ title }) => {
  const insets = useSafeAreaInsets();

  return (
    <Spacing insets={insets}>
      <Wordmark title={title} />
      <HeaderButtons />
    </Spacing>
  );
};

TabHeader.propTypes = {
  title: PropTypes.string,
};
TabHeader.defaultProps = {
  title: 'CHRIST FELLOWSHIP',
};

export default TabHeader;
