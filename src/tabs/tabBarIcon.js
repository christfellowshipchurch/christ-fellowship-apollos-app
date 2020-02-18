import React from 'react';
import PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

const tabBarIcon = (name) => {
  function TabBarIcon({ tintColor }) {
    return (
      <FontAwesomeIcon
        icon={['fal', name]}
        fill={tintColor}
        size={name === 'home' ? 24 : 22}
      />
    );
  }
  TabBarIcon.propTypes = {
    tintColor: PropTypes.string,
  };
  return TabBarIcon;
};

export default tabBarIcon;
