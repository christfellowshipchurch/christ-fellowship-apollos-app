import React, { PureComponent, useState } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { Query, ApolloConsumer } from 'react-apollo';

import {
  Touchable,
  ButtonLink,
  withTheme,
  H5,
  styled,
} from '@apollosproject/ui-kit'
import GET_USER_PROFILE from '../../getUserProfile'
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
  marginBottom: theme.sizing.baseUnit * 0.75,
  marginTop: theme.sizing.baseUnit * 0.5,
}))(View)

const RoundTouchable = withTheme(({ theme, size }) => ({
  // borderRadius: get(theme.sizing.avatar, size, theme.sizing.avatar.small),
}))(Touchable)

const Wrapper = styled({
  justifyContent: 'center',
  alignItems: 'center',
})(View)

const LightButtonLink = styled(({ theme }) => ({
  color: theme.colors.white,
}))(ButtonLink)

const AvatarForm = ({
  disabled,
  text,
  animation
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
          // size="large"
          >
            <GetPhotoData>
              {({ photo }) => (
                <StyledView>
                  <Avatar
                    source={photo}
                    size="large"
                    isLoading={isUploadingFile}
                    animation={animation}
                  />
                </StyledView>
              )}
            </GetPhotoData>
          </RoundTouchable>
          {text ? (
            <H5>
              <LightButtonLink onPress={() => handleUploadPhoto({ client })}>
                Change Photo
              </LightButtonLink>
            </H5>
          ) : null}
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