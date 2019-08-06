import React, { PureComponent } from 'react';
import { ScrollView, SafeAreaView } from 'react-native';
import PropTypes from 'prop-types';

import { BackgroundView, styled } from '@apollosproject/ui-kit';
import ActionTable from './ActionTable';
import Toolbar from './Toolbar';
import { UserAvatarHeaderConnected } from './UserAvatarHeader';
import { RecentlyLikedTileFeedConnected } from './RecentlyLikedTileFeed';

const StyledScrollView = styled(({ theme }) => ({
  marginVertical: theme.sizing.baseUnit,
}))(ScrollView);

class Connect extends PureComponent {
  static navigationOptions = () => ({
    title: 'Connect',
    header: null,
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
      navigate: PropTypes.func,
    }),
  };

  render() {
    return (
      <BackgroundView>
        <SafeAreaView>
          <StyledScrollView>
            <UserAvatarHeaderConnected key="UserAvatarHeaderConnected" />
            <RecentlyLikedTileFeedConnected key="RecentlyLikedTileFeedConnected" />
            <Toolbar />
            <ActionTable />
          </StyledScrollView>
        </SafeAreaView>
      </BackgroundView>
    );
  }
}

export default Connect;
