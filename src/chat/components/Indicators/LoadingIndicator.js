import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { SafeAreaView } from 'react-native';

import { styled, UIText, ActivityIndicator } from '@apollosproject/ui-kit';
import { TranslationContext } from '../../context';

const Container = styled({
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
})(SafeAreaView);

const LoadingText = styled({
  marginTop: 50,
})(UIText);

const LoadingIndicator = ({ listType = 'default', loadingText }) => {
  const { t } = useContext(TranslationContext);
  let indicatorText = '';

  switch (listType) {
    case 'channel':
      indicatorText = loadingText || t('Loading channels ...');
      break;
    case 'message':
      indicatorText = loadingText || t('Loading messages ...');
      break;
    case 'default':
    default:
      indicatorText = loadingText || t('Loading ...');
  }

  return (
    <Container>
      <ActivityIndicator size={'large'} />
      <LoadingText>{indicatorText}</LoadingText>
    </Container>
  );
};

LoadingIndicator.propTypes = {
  listType: PropTypes.oneOf(['channel', 'message', 'default']),
  loadingText: PropTypes.string,
};

export default LoadingIndicator;
