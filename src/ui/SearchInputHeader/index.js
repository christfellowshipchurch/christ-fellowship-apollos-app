/* eslint-disable react-native/no-unused-styles */
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { styled, PaddedView, SearchInput } from '@apollosproject/ui-kit';

const HeaderBorder = styled(
    ({ theme }) => ({
        paddingLeft: theme.sizing.baseUnit,
    }),
    'SearchInputHeader.HeaderBorder'
)(PaddedView);

// This element is used to clip the Android shadow in every directection except the bottom.
const AndroidClipElevationFix = styled(
    {
        ...Platform.select({
            android: {
                paddingBottom: 4,
                overflow: 'hidden',
            },
        }),
    },
    'SearchInputHeader.AndroidClipElevationFix'
)(View);

const ReactNavigationStyleReset = StyleSheet.create({
    header: {
        borderBottomWidth: 0,
        elevation: 0,
    },
});

const SearchInputHeader = ({ style, ...props }) => (
    <AndroidClipElevationFix style={style}>
        <HeaderBorder vertical={false}>
            <SearchInput {...props} />
        </HeaderBorder>
    </AndroidClipElevationFix>
);

SearchInputHeader.propTypes = {
    ...SearchInput.propTypes,
};

export { SearchInputHeader as default, ReactNavigationStyleReset };
