import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { get } from 'lodash';

import { withTheme, styled, ActivityIndicator } from '@apollosproject/ui-kit';

import ActionBar, { ActionBarItem } from '../../ui/ActionBar';

import { openLink } from '../../utils/linking';
import { GET_PROFILE_ACTIONS } from './queries';

const StyledActionBar = styled(({ theme }) => ({
  marginTop: theme.sizing.baseUnit,
}))(ActionBar);

const StyledActionBarItem = withTheme(({ theme, tint }) => ({
  tint: theme.colors[tint],

  style: {
    flex: 1,
    alignItems: 'center',
  },
}))(ActionBarItem);

const tints = ['alert', 'warning', 'success'];

const ProfileActionBar = () => {
  const { loading, error, data } = useQuery(GET_PROFILE_ACTIONS, {
    fetchPolicy: 'cache-and-network',
  });

  const actions = get(data, 'profileLinks', []);

  if ((error && !loading) || (!loading && data && !actions.length)) return null;

  return (
    <StyledActionBar>
      {loading ? (
        <ActivityIndicator />
      ) : (
          actions.map(({ icon, name, uri, openInApp }, i) => (
            <StyledActionBarItem
              onPress={() => openLink({ uri, openInApp, title: name })}
              icon={icon}
              label={name}
              tint={tints[i]}
            />
          ))
        )}
    </StyledActionBar>
  );
};

ProfileActionBar.propTypes = {};

export default ProfileActionBar;
