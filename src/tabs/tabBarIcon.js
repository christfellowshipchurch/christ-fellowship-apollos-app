import React from 'react';
import PropTypes from 'prop-types';

import { Icon, styled } from '@apollosproject/ui-kit';

const StyledIcon = styled(({ theme }) => ({
  marginBottom: 5,
}))(Icon);

const tabBarIcon = (name) => {
  function TabBarIcon({ tintColor }) {
    return <StyledIcon name={name} fill={tintColor} size={24} />;
  }
  TabBarIcon.propTypes = {
    tintColor: PropTypes.string,
  };
  return TabBarIcon;
};

export default tabBarIcon;
