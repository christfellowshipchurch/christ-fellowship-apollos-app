import React, { PureComponent } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { Query, ApolloConsumer } from 'react-apollo';

import {
  Touchable,
  ButtonLink,
  Avatar,
  withTheme,
  H5,
  styled,
} from '@apollosproject/ui-kit';
import GET_USER_PROFILE from '../../tabs/connect/getUserProfile';
import uploadPhoto from './uploadPhoto';

const GetPhotoData = ({ children }) => (
  <Query query={GET_USER_PROFILE}>
    {({ data: { currentUser = {} } = {} }) => {
      const photo = get(currentUser, 'profile.photo');
      return children({ photo });
    }}
  </Query>
);

GetPhotoData.propTypes = {
  children: PropTypes.func.isRequired,
};

const StyledView = styled(({ theme }) => ({
  marginRight: 0,
  marginBottom: theme.sizing.baseUnit * 0.75,
  marginTop: theme.sizing.baseUnit * 0.5,
}))(View);

const RoundTouchable = withTheme(({ theme, size }) => ({
  borderRadius: get(theme.sizing.avatar, size, theme.sizing.avatar.small),
}))(Touchable);

const Wrapper = styled({
  justifyContent: 'center',
  alignItems: 'center',
})(View);

export default class AvatarForm extends PureComponent {
  state = {
    isUploadingFile: false,
  };

  componentWillUnmount() {
    this.setState({ isUploadingFile: false });
  }

  handleUploadPhoto = async ({ client }) => {
    try {
      await uploadPhoto({
        client,
        onUpload: () => this.setState({ isUploadingFile: true }),
      });
      await this.setState({ isUploadingFile: false });
    } catch (e) {
      console.warn(e);
      this.setState({ isUploadingFile: false });
    }
  };

  render() {
    const { isUploadingFile } = this.state;

    return (
      <ApolloConsumer>
        {(client) => (
          <Wrapper>
            <RoundTouchable
              disabled={this.props.disabled}
              onPress={() => this.handleUploadPhoto({ client })}
              size="medium"
            >
              <GetPhotoData>
                {({ photo }) => (
                  <StyledView>
                    <Avatar
                      source={photo}
                      size="medium"
                      isLoading={isUploadingFile}
                    />
                  </StyledView>
                )}
              </GetPhotoData>
            </RoundTouchable>
            {this.props.text ? (
              <H5>
                <ButtonLink onPress={() => this.handleUploadPhoto({ client })}>
                  Change Photo
                </ButtonLink>
              </H5>
            ) : null}
          </Wrapper>
        )}
      </ApolloConsumer>
    );
  }
}

AvatarForm.propTypes = {
  disabled: PropTypes.bool,
  text: PropTypes.bool,
};
