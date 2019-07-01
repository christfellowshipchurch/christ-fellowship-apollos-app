import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import {
  H3,
  PaddedView,
  ConnectedImage,
  styled,
  ChannelLabel,
  withIsLoading,
} from '@apollosproject/ui-kit';

import AvatarForm from './AvatarForm';

const Container = styled(({ theme }) => ({
  backgroundColor: theme.colors.background.paper,
  flexDirection: 'row',
}))(View);

const Content = styled(({ theme }) => ({
  flex: 1,
  justifyContent: 'center',
  paddingVertical: theme.sizing.baseUnit * 0.5,
}))(PaddedView);

const UserAvatarView = withIsLoading(
  ({
    theme,
    firstName,
    lastName,
    location,
    isLoading,
    disabled,
    ...viewProps
  }) => (
    // todo: handle file select stuff
    <Container {...viewProps}>
      <AvatarForm isLoading={isLoading} text={false} disabled={disabled} />
      <Content>
        <H3>
          {firstName} {lastName}
        </H3>
        {location && (
          <ChannelLabel icon="pin" label={location} isLoading={isLoading} />
        )}
      </Content>
    </Container>
  )
);

UserAvatarView.propTypes = {
  photo: ConnectedImage.propTypes.source,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  location: PropTypes.string,
  isLoading: PropTypes.bool,
  disabled: PropTypes.bool,
  blurIntensity: PropTypes.number,
  ...View.propTypes,
};

export default UserAvatarView;
