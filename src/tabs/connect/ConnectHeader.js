import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { PaddedView, H4, H6, styled } from '@apollosproject/ui-kit';
import { UserAvatarConnected } from '@apollosproject/ui-connected';

import { useCurrentUser } from 'hooks';

const Title = styled(({ theme }) => ({
  marginTop: theme.sizing.baseUnit * 0.5,
}))(H4);

const Subtitle = styled(({ theme }) => ({
  fontWeight: '400',
}))(H6);

const Flag = styled({
  flexDirection: 'row',
})(View);

const FlagMedia = styled(({ theme }) => ({}))(PaddedView);

const FlagContent = styled({
  justifyContent: 'center',
})(View);

const ConnectHeader = ({ onPressIcon }) => {
  const { loading, firstName, lastName, campus } = useCurrentUser();

  return (
    <Flag>
      <FlagMedia>
        <UserAvatarConnected
          size={'medium'}
          buttonIcon={'settings'}
          onPressIcon={onPressIcon}
        />
      </FlagMedia>
      <FlagContent>
        <Title isLoading={loading}>{`${firstName} ${lastName}`}</Title>
        {campus &&
          campus.name !== '' && (
            <Subtitle isLoading={loading}>{campus.name}</Subtitle>
          )}
      </FlagContent>
    </Flag>
  );
};

ConnectHeader.propTypes = {
  onPressIcon: PropTypes.func,
};

export default ConnectHeader;
