import React from 'react';
import { View } from 'react-native';

import { styled } from '@apollosproject/ui-kit';

const AndroidBlurView = styled(({ theme, blurType }) => ({
    backgroundColor: blurType.toUpperCase().includes('LIGHT')
        ? theme.colors.white
        : blurType.toUpperCase().includes('DARK')
            ? theme.colors.black
            : theme.colors.background.screen,
}))(View);

export default AndroidBlurView;
