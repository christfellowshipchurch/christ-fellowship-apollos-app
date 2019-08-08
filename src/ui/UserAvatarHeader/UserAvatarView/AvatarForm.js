import React, { useState } from 'react';
import { View, Platform } from 'react-native';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { Query, ApolloConsumer } from 'react-apollo';

import {
  Touchable,
  withTheme,
  styled,
} from '@apollosproject/ui-kit'
import GET_USER_PROFILE from '../getUserProfile'
import uploadPhoto from './uploadPhoto'

import Avatar from './Avatar'

const GetPhotoData = ({ children }) => (
  <Query query={GET_USER_PROFILE}>
    {({ data: { currentUser = {} } = {} }) => {
      const photo = get(currentUser, 'profile.photo')
      return children({ photo });
    }}
  </Query>
)

GetPhotoData.propTypes = {
  children: PropTypes.func.isRequired,
}

const StyledView = styled(({ theme }) => ({
  marginRight: 0,
  padding: theme.sizing.baseUnit * 0.5,
}))(View)

const RoundTouchable = withTheme(({ theme, size }) => ({
  ...Platform.select(theme.shadows.default),
}))(Touchable)

const Wrapper = styled({
  justifyContent: 'center',
  alignItems: 'center',
})(View)

const AvatarForm = ({
  disabled,
  animation,
  edit
}) => {
  const [isUploadingFile, setIsUploadingFile] = useState(false)
  const handleUploadPhoto = async ({ client }) => {
    try {
      await uploadPhoto({
        client,
        onUpload: () => setIsUploadingFile(true),
      })

      await setIsUploadingFile(false)
    } catch (e) {
      console.warn(e)
      setIsUploadingFile(false)
    }
  };

  return (
    <ApolloConsumer>
      {(client) => (
        <Wrapper>
          <RoundTouchable
            disabled={disabled}
            onPress={() => handleUploadPhoto({ client })}
          >
            <GetPhotoData>
              {({ photo }) => (
                <StyledView>
                  <Avatar
                    source={photo}
                    size="large"
                    isLoading={isUploadingFile}
                    animation={animation}
                    edit={edit}
                  />
                </StyledView>
              )}
            </GetPhotoData>
          </RoundTouchable>
        </Wrapper>
      )}
    </ApolloConsumer>
  );
}

AvatarForm.propTypes = {
  disabled: PropTypes.bool,
  text: PropTypes.bool,
}

export default AvatarForm