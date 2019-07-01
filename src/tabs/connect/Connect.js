import React, { PureComponent } from 'react';
import { ScrollView, SafeAreaView } from 'react-native';
import { Query } from 'react-apollo';
import { get } from 'lodash';
import PropTypes from 'prop-types';

import { LoginButton, GET_LOGIN_STATE } from '@apollosproject/ui-auth';
import {
  H1,
  BodyText,
  Paragraph,
  BackgroundView,
  withTheme,
  styled,
  Icon,
  PaddedView,
} from '@apollosproject/ui-kit';
import ActionTable from './ActionTable';
import Toolbar from './Toolbar';
import { UserAvatarHeaderConnected } from './UserAvatarHeader';
import { RecentlyLikedTileFeedConnected } from './RecentlyLikedTileFeed';

const Title = styled(({ theme }) => ({
  color: theme.colors.primary,
  paddingBottom: theme.helpers.verticalRhythm(1.5),
}))(H1);

const BrandIcon = withTheme(({ theme }) => ({
  name: 'brand-icon',
  size: theme.sizing.baseUnit * 2.25,
  marginBottom: theme.sizing.baseUnit,
  fill: theme.colors.primary,
}))(Icon);

const Header = styled(({ theme }) => ({
  paddingBottom: theme.sizing.baseUnit * 1.5,
  backgroundColor: theme.colors.background.paper,
  paddingTop: theme.sizing.baseUnit * 4,
}))(PaddedView);

const StyledLoginButton = styled(({ theme }) => ({
  marginVertical: theme.sizing.baseUnit,
}))(LoginButton);

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
        <Query query={GET_LOGIN_STATE}>
          {({ data }) => {
            if (get(data, 'isLoggedIn', false))
              return (
                <SafeAreaView>
                  <StyledScrollView>
                    <UserAvatarHeaderConnected key="UserAvatarHeaderConnected" />
                    <RecentlyLikedTileFeedConnected key="RecentlyLikedTileFeedConnected" />
                    <Toolbar />
                    <ActionTable />
                  </StyledScrollView>
                </SafeAreaView>
              );
            return (
              <SafeAreaView>
                <ScrollView>
                  <Header>
                    <BrandIcon />
                    <Title>Connect!</Title>
                    <Paragraph>
                      <BodyText>
                        Our mission is to help you connect to others as well as
                        help you in your walk with Christ.
                      </BodyText>
                    </Paragraph>
                    <Paragraph>
                      <BodyText>
                        By joining this community, you will unlock amazing
                        features like; curated content and devotionals, simple
                        event registration, and easy online giving!
                      </BodyText>
                    </Paragraph>
                    <StyledLoginButton />
                  </Header>
                  <ActionTable />
                </ScrollView>
              </SafeAreaView>
            );
          }}
        </Query>
      </BackgroundView>
    );
  }
}

export default Connect;
