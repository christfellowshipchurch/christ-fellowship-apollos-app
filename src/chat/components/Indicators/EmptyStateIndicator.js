import React from 'react';
import PropTypes from 'prop-types';
import { SafeAreaView } from 'react-native';

import { styled, UIText } from '@apollosproject/ui-kit';

const Container = styled({
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
})(SafeAreaView);

const EmptyText = styled(({ theme }) => ({
  color: theme.colors.text.tertiary,
  textAlign: 'center',
}))(UIText);

const EmptyStateIndicator = ({ listType }) => {
  let emptyText = 'You have no items.';

  switch (listType) {
    case 'channel':
      emptyText = 'You have no channels.';
      break;
    case 'message':
      emptyText = 'No messages yet. Be the first\nto share your thoughts!\n☺️';
      break;
    default:
      break;
  }

  return (
    <Container>
      <EmptyText>{emptyText}</EmptyText>
    </Container>
  );
};

EmptyStateIndicator.propTypes = {
  listType: PropTypes.oneOf(['channel', 'message', 'default']),
};

export default EmptyStateIndicator;
