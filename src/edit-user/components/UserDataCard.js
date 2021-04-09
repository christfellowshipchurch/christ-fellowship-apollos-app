/**
 * UserDataCard.js
 *
 * Author: Caleb Panza
 * Created: Apr 09, 2021
 *
 * Renders a card with a specified Icon and an Action to be used to display User Information
 */

import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';

import { View } from 'react-native';
import {
  withTheme,
  styled,
  Card,
  PaddedView,
  Icon,
  Touchable,
} from '@apollosproject/ui-kit';

// :: Styles
// :: ========================
const IconSpacing = styled(({ theme }) => ({
  paddingBottom: theme.sizing.baseUnit * 0.5,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
}))(View);

const StyledIcon = withTheme(({ theme }) => ({
  fill: theme.colors.text.tertiary,
  size: 20,
}))(Icon);

// :: Components
// :: ======================
const EditIcon = withTheme(({ theme }) => ({
  fill: theme.colors.primary,
  size: 20,
  name: 'pen',
}))(Icon);

const UserDataCard = ({ icon, action, children }) => (
  <Card>
    <PaddedView>
      <IconSpacing>
        {!isEmpty(icon) && <StyledIcon name={icon} />}
        {!!action && (
          <Touchable onPress={action}>
            <EditIcon />
          </Touchable>
        )}
      </IconSpacing>
      {children}
    </PaddedView>
  </Card>
);

UserDataCard.propTypes = {
  action: PropTypes.func,
  children: PropTypes.node,
  icon: PropTypes.string,
};
UserDataCard.defaultProps = {
  action: null,
};

export default UserDataCard;
