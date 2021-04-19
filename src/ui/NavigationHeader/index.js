import React from 'react';
import PropTypes from 'prop-types';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { View } from 'react-native';
import { ModalCloseButton, Icon, styled } from '@apollosproject/ui-kit';

const HeaderWrapper = styled(({ theme, insets }) => ({
  position: 'absolute',
  zIndex: 999,
  top: 0,
  width: '100%',
  flexDirection: 'row',
  justifyContent: 'space-between',
  paddingLeft: theme.sizing.baseUnit,
  paddingRight: insets?.right
    ? theme.sizing.baseUnit + insets.right
    : theme.sizing.baseUnit,
  paddingTop: insets?.top
    ? theme.sizing.baseUnit + insets.top
    : theme.sizing.baseUnit,
}))(View);

const NavigationHeader = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const onClose = () => navigation.goBack(null);

  return (
    <HeaderWrapper pointerEvents={'box-none'} insets={insets}>
      <Icon name="empty" />
      {onClose ? (
        <ModalCloseButton name={'close'} onPress={onClose} />
      ) : (
        <Icon name="empty" />
      )}
    </HeaderWrapper>
  );
};

NavigationHeader.propTypes = {
  scene: PropTypes.shape({
    index: PropTypes.number,
  }),
  navigation: PropTypes.shape({
    pop: PropTypes.func,
    popToTop: PropTypes.func,
  }),
};

export default NavigationHeader;
