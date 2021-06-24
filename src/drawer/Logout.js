import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { useMutation } from '@apollo/client';
import { getVersion } from 'react-native-device-info';

import {
  BodyText,
  FlexedView,
  styled,
  NavigationService,
} from '@apollosproject/ui-kit';

import { LOGOUT } from '@apollosproject/ui-auth';
import { useStreamChat } from '../stream-chat';

import { TableView, Cell } from '../ui/TableView';

const VersionText = styled(({ theme }) => ({
  fontSize: 14,
  marginTop: theme.sizing.baseUnit * 0.5,
  color: theme.colors.text.tertiary,
}))(BodyText);

const Logout = ({ onLogout }) => {
  const [handleLogout] = useMutation(LOGOUT);
  const { disconnectUser } = useStreamChat();

  return (
    <View>
      <FlexedView style={{ justifyContent: 'center', alignItems: 'center' }}>
        <VersionText>{`Version ${getVersion()}`}</VersionText>
      </FlexedView>
      <TableView>
        <Cell
          icon="share-square"
          title="Log Out"
          onPress={async () => {
            await handleLogout();
            await disconnectUser();
            // This resets the navigation stack, and the navigates to the first auth screen.
            // This ensures that user isn't navigated to a subscreen of Auth, like the pin entry screen.
            await NavigationService.resetToAuth();
            onLogout();
          }}
        />
      </TableView>
    </View>
  );
};

Logout.propTypes = {
  onLogout: PropTypes.func,
};

Logout.defaultProps = {
  onLogout: () => null,
};

export default Logout;
