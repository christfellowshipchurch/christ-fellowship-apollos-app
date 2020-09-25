import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native';

import { styled, UIText } from '@apollosproject/ui-kit';
import { lightenBy } from 'utils/theme';
import { withTranslationContext } from '../../context';

const Container = styled(({ theme }) => ({
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: lightenBy(theme.colors.alert, 0.25).hex(),
  padding: 3,
}))(TouchableOpacity);

const ErrorText = styled(({ theme }) => ({
  color: theme.colors.alert,
  padding: 3,
}))(UIText);

const ChannelListHeaderErrorIndicator = withTranslationContext(
  ({ onPress, t }) => (
    <Container
      onPress={() => {
        onPress && onPress();
      }}
    >
      <ErrorText>{t('Error while loading, please reload/refresh')}</ErrorText>
    </Container>
  )
);

ChannelListHeaderErrorIndicator.propTypes = {
  onPress: PropTypes.func,
};

export default ChannelListHeaderErrorIndicator;
