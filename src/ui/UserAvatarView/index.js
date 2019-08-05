import React from 'react';
import PropTypes from 'prop-types';
import { View, ImageBackground } from 'react-native';

import {
  H3,
  H5,
  PaddedView,
  ConnectedImage,
  styled,
  ChannelLabel,
  withIsLoading,
  Icon
} from '@apollosproject/ui-kit';

import AvatarForm from './AvatarForm';

const Container = styled(({ theme }) => ({
  flexDirection: 'column',
}))(View);

const Content = styled(({ theme }) => ({
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  paddingVertical: theme.sizing.baseUnit * 0.5,
  color: theme.colors.white
}))(PaddedView)

const StyledHeader = styled(({ theme }) => ({
  color: theme.colors.white
}))(H3)

const StyledSubHeader = styled(({ theme }) => ({
  color: theme.colors.white,
  paddingLeft: theme.sizing.baseUnit * 0.25
}))(H5)

const Location = styled(({ theme }) => ({
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center'
}))(View)

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
        <Content>
          <AvatarForm isLoading={isLoading} text={false} disabled={disabled} />
          <StyledHeader>
            {firstName} {lastName}
          </StyledHeader>
          {location && (
            <Location>
              <Icon name={'pin'} fill={'white'} size={'12'} isLoading={isLoading} />
              <StyledSubHeader>{location}</StyledSubHeader>
            </Location>
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
