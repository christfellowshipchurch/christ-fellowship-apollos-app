import React from 'react';
import { View } from 'react-native';
import {
  styled,
  withTheme,
  ActivityIndicator,
  Placeholder,
} from '@apollosproject/ui-kit';

const PaddedView = styled(({ theme }) => ({
  padding: theme.sizing.baseUnit,
}))(View);

const FlexedView = styled({
  flex: 1,
})(PaddedView);

const LoadingBar = styled(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-start',
  paddingVertical: theme.sizing.baseUnit,
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

const LoadingChannels = () => (
  <React.Fragment>
    <PaddedView>
      <ActivityIndicator size={'large'} />
    </PaddedView>
    <FlexedView>
      <LoadingBar>
        <LoadingAvatar />
        <LoadingMessage />
      </LoadingBar>
      <LoadingBar>
        <LoadingAvatar />
        <LoadingMessage width={'50%'} />
      </LoadingBar>
      <LoadingBar>
        <LoadingAvatar />
        <LoadingMessage width={'50%'} />
      </LoadingBar>
    </FlexedView>
  </React.Fragment>
);

export default LoadingChannels;
