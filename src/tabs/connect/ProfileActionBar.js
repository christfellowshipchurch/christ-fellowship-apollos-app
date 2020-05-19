import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { get, uniqueId } from 'lodash';

import { styled, ActivityIndicator, ThemeMixin } from '@apollosproject/ui-kit';
import { AnalyticsConsumer } from '@apollosproject/ui-analytics';
import { routeLink } from '../../utils/linking';

import ActionBar, { ActionBarItem } from '../../ui/ActionBar';
import { GET_PROFILE_ACTIONS } from './queries';

const StyledActionBar = styled(({ theme }) => ({
  marginTop: theme.sizing.baseUnit,
}))(ActionBar);

const ProfileActionBar = () => {
  const { loading, error, data } = useQuery(GET_PROFILE_ACTIONS, {
    fetchPolicy: 'cache-and-network',
  });

  const actions = get(data, 'profileLinks', []);

  if ((error && !loading) || (!loading && data && !actions.length)) return null;

  return actions.length && !loading ? (
    <StyledActionBar>
      {loading ? (
        <ActivityIndicator />
      ) : (
          actions.map(({ icon, name, uri, theme = {} }, i) => (
            <AnalyticsConsumer>
              {({ track }) => (
                <ThemeMixin mixin={theme}>
                  <ActionBarItem
                    onPress={() => {
                      track({
                        eventName: 'Pressed Profile Action Bar Item',
                        properties: { label: name },
                      });
                      routeLink(uri);
                    }}
                    icon={icon}
                    label={name}
                    key={uniqueId(`ProfileActionBar:${i}`)}
                  />
                </ThemeMixin>
              )}
            </AnalyticsConsumer>
          ))
        )}
    </StyledActionBar>
  ) : null;
};

ProfileActionBar.propTypes = {};

export default ProfileActionBar;
