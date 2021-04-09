/**
 * CampusCard.js
 *
 * Author: Caleb Panza
 * Created: Apr 09, 2021
 *
 * Shows the current user's campus wrapped in a Card
 */

import React from 'react';
import PropTypes from 'prop-types';
import { useNavigation } from '@react-navigation/native';
import { useCurrentUser } from 'hooks';

import { H4 } from '@apollosproject/ui-kit';
import UserDataCard from './UserDataCard';

const CampusCard = () => {
  const navigation = useNavigation();
  const { campus } = useCurrentUser();

  const action = () => navigation.navigate('Location');

  return (
    <UserDataCard icon="campus" action={action}>
      <H4>{campus?.name}</H4>
    </UserDataCard>
  );
};

CampusCard.propTypes = {};
CampusCard.defaultProps = {};

export default CampusCard;
