import React from 'react';
import { View, Animated, ScrollView } from 'react-native';
import PropTypes from 'prop-types';
import { SafeAreaView } from 'react-navigation';

import { styled, withTheme, Icon, UIText } from '@apollosproject/ui-kit';

import {
  navigationOptions,
  BackgroundView,
  HEADER_OFFSET,
  NavigationSpacer,
  useHeaderScrollEffect,
} from '../../navigation';
import StatusBar from '../../ui/StatusBar';
import ProfileActionBar from './ProfileActionBar';
import ConnectHeader from './ConnectHeader';

const CheckBoxRowContainer = styled(({ theme }) => ({
  marginVertical: theme.sizing.baseUnit * 0.25,
  flexDirection: 'row',
  alignItems: 'center',
  opacity: 0.35,
}))(View);

const CheckBoxIcon = withTheme(({ theme, active }) => ({
  name: active ? 'checkbox-checked' : 'checkbox-unchecked',
  size: 16,
  fill: theme.colors.text.primary,
  style: {
    marginRight: theme.sizing.baseUnit * 0.25,
    opacity: 0.75,
  },
}))(Icon);

const CheckBoxRow = ({ active, type }) => (
  <CheckBoxRowContainer>
    <CheckBoxIcon active={active} />
    <UIText>{`${type} is ${active ? 'enabled' : 'disabled'}`}</UIText>
  </CheckBoxRowContainer>
);

CheckBoxRow.propTypes = {
  active: PropTypes.bool,
  type: PropTypes.string.isRequired,
};

CheckBoxRow.defaultProps = {
  active: false,
};

const Connect = ({ navigation }) => {
  const { scrollY } = useHeaderScrollEffect({ navigation });

  return (
    <BackgroundView>
      <SafeAreaView
        style={{ flex: 1 }}
        forceInset={{ bottom: 'never', top: 'always' }}
      >
        <StatusBar />
        <ScrollView
          scrollEventThrottle={16}
          onScroll={Animated.event([
            {
              nativeEvent: {
                contentOffset: { y: scrollY },
              },
            },
          ])}
        >
          <NavigationSpacer />
          <ConnectHeader
            onPressIcon={() => navigation.navigate('EditCurrentUser')}
          />
          <ProfileActionBar />
        </ScrollView>
      </SafeAreaView>
    </BackgroundView>
  );
};

Connect.navigationOptions = (props) =>
  navigationOptions({
    ...props,
    title: 'Profile',
  });

Connect.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
    navigate: PropTypes.func,
  }),
};

export default Connect;
