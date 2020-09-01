/* eslint-disable react-native/no-unused-styles */
import React, { useState, useEffect } from 'react';
import { Platform, StyleSheet, View, TextInput } from 'react-native';
import PropTypes from 'prop-types';

import {
  styled,
  SearchInput,
  PaddedView,
  withTheme,
  Icon,
  ButtonIcon,
} from '@apollosproject/ui-kit';

const LoopIcon = withTheme(({ theme, isFocused }) => ({
  fill: isFocused ? theme.colors.text.primary : theme.colors.text.tertiary,
  size: theme.helpers.rem(1),
  style: {
    marginLeft: theme.sizing.baseUnit,
  },
}))(Icon);

const ClearSearchButton = withTheme(({ theme, isVisible }) => ({
  fill: theme.colors.text.tertiary,
  size: theme.helpers.rem(1),
  iconPadding: theme.helpers.rem(0.75),
  style: {
    opacity: isVisible ? 1 : 0,
  },
}))(ButtonIcon);

const TextInputWrapper = styled(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  borderRadius: theme.sizing.baseBorderRadius,
  backgroundColor: theme.colors.background.screen,
  overflow: 'hidden',
}))(View);

const Input = withTheme(({ theme }) => ({
  placeholderTextColor: theme.colors.text.tertiary,
  selectionColor: theme.colors.primary,
  style: {
    color: theme.colors.text.primary, // fixes android text color when switching theme types
    flexGrow: 1, // fixes weird text behind icon (ios) and placeholder clipping (android) bugs
    height: theme.helpers.rem(2.5), // we have to have a height to make this display correctly. using typographic unit to scale with text size.
    paddingVertical: 0, // removes weird "default" padding
    paddingHorizontal: theme.sizing.baseUnit * 0.5,
    fontSize: theme.helpers.rem(0.875),
    fontFamily: theme.typography.ui.regular,
    ...Platform.select({
      // aligns text with icon on ios
      ios: {
        paddingTop: 1,
      },
    }),
  },
}))(TextInput);

const Layout = styled(({ theme }) => ({
  flex: 1,
}))(PaddedView);

const SearchInputHeader = ({
  style,
  placeholder,
  isFocused: initialIsFocused,
  onFocus,
  value: initialValue,
}) => {
  const [isFocused, setIsFocused] = useState(initialIsFocused);
  const [value, setValue] = useState(initialValue);
  const resetTextValue = () => setValue('');

  return (
    <Layout vertical={false}>
      <TextInputWrapper style={style}>
        <LoopIcon name={'search'} isFocused={isFocused} />
        <Input
          value={value}
          onChangeText={(newValue) => setValue(newValue)}
          placeholder={placeholder}
          isFocused={isFocused}
          onFocus={() => {
            setIsFocused(true);
            onFocus(true);
          }}
          onEndEditing={() => {
            setIsFocused(false);
            onFocus(false);
          }}
        />
        <ClearSearchButton
          onPress={resetTextValue}
          name={'close'}
          isVisible={!!value && value !== ''}
        />
      </TextInputWrapper>
    </Layout>
  );
};

SearchInputHeader.propTypes = {
  placeholder: PropTypes.string,
  isFocused: PropTypes.bool,
  onFocus: PropTypes.func,
  value: PropTypes.string,
};

SearchInputHeader.defaultProps = {
  placeholder: 'Search',
  isFocused: false,
  onFocus: () => null,
  value: '',
};

export default SearchInputHeader;
