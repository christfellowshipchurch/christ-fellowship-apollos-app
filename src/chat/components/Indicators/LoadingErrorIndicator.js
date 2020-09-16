import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native';

import { styled, UIText } from '@apollosproject/ui-kit';
import { TranslationContext } from '../../context';

const Container = styled({
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
})(TouchableOpacity);

const ErrorText = styled({
  marginTop: 50,
})(UIText);

const RetryText = styled({})(UIText);

const LoadingErrorIndicator = ({ listType, retry }) => {
  const { t } = useContext(TranslationContext);

  switch (listType) {
    case 'channel':
      return (
        <Container
          onPress={() => {
            retry && retry();
          }}
        >
          <ErrorText>{t('Error loading channel list ...')}</ErrorText>
          <RetryText>⟳</RetryText>
        </Container>
      );
    case 'message':
      return (
        <Container>
          <ErrorText>
            {t('Error loading messages for this channel ...')}
          </ErrorText>
        </Container>
      );
    default:
      return (
        <Container>
          <ErrorText>{t('Error loading')}</ErrorText>
        </Container>
      );
  }
};

LoadingErrorIndicator.propTypes = {
  listType: PropTypes.oneOf(['channel', 'message', 'default']),
  // Calls the retry handler.
  retry: PropTypes.func,
};

export default LoadingErrorIndicator;
