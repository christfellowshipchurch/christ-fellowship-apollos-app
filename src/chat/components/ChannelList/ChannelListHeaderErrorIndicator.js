import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native';

import { styled, UIText } from '@apollosproject/ui-kit';
import { withTranslationContext } from '../../context';

const Container = styled({
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#fae6e8',
  padding: 3,
})(TouchableOpacity);

const ErrorText = styled({
  color: 'red',
  padding: 3,
})(UIText);

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
