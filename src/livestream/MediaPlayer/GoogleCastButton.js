import { CastButton } from 'react-native-google-cast';

import { styled } from '@apollosproject/ui-kit';

const StyledCastButton = styled(({ theme }) => ({
  width: 40 + theme.sizing.baseUnit * 1.25,
  height: 40 + theme.sizing.baseUnit * 1.25,
  tintColor: theme.colors.paper,
}))(CastButton);

export default StyledCastButton;
