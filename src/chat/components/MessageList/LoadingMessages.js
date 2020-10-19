import React from 'react';
import { View } from 'react-native';
import {
  styled,
  withTheme,
  ActivityIndicator,
  Placeholder,
  FlexedView,
} from '@apollosproject/ui-kit';

const FlexedViewBottom = styled(({ theme }) => ({
  justifyContent: 'flex-end',
  padding: theme.sizing.baseUnit,
}))(FlexedView);

const LoadingBar = styled(({ theme, alignment = 'left' }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: alignment === 'left' ? 'flex-start' : 'flex-end',
  paddingVertical: theme.sizing.baseUnit / 2,
  opacity: 0.3,
}))(View);

const LoadingAvatar = withTheme(({ theme }) => ({
  borderRadius: theme.sizing.baseUnit * 3.125,
  size: theme.sizing.baseUnit * 3.125,
}))(Placeholder.Media);

const LoadingMessage = withTheme(({ theme, width = '66%' }) => ({
  width,
  style: {
    alignSelf: 'center',
    marginHorizontal: theme.sizing.baseUnit,
  },
}))(Placeholder.Line);

const LoadingMessages = () => (
  <React.Fragment>
    <FlexedView>
      <ActivityIndicator size={'large'} />
    </FlexedView>
    <FlexedViewBottom>
      <LoadingBar alignment={'right'}>
        <LoadingMessage width={'50%'} />
        <LoadingAvatar />
      </LoadingBar>
      <LoadingBar>
        <LoadingAvatar />
        <LoadingMessage width={'50%'} />
      </LoadingBar>
      <LoadingBar>
        <LoadingAvatar />
        <LoadingMessage />
      </LoadingBar>
    </FlexedViewBottom>
  </React.Fragment>
);

export default LoadingMessages;
