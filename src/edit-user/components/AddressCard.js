/**
 * AddressCard.js
 *
 * Author: Caleb Panza
 * Created: Apr 09, 2021
 *
 * Shows the current user's address wrapped in a Card
 */

import React from 'react';
import PropTypes from 'prop-types';
import { useNavigation } from '@react-navigation/native';
import { useCurrentUser } from 'hooks';

import { UIText } from '@apollosproject/ui-kit';
import UserDataCard from './UserDataCard';

const AddressCard = () => {
  const navigation = useNavigation();
  const { address } = useCurrentUser();

  const action = () => navigation.navigate('EditAddress');

  return (
    <UserDataCard icon="home" action={action}>
      <UIText bold>{address?.street1}</UIText>
      <UIText bold>{`${address?.city}, ${address?.state} ${
        address?.postalCode
      }`}</UIText>
    </UserDataCard>
  );
};

AddressCard.propTypes = {};
AddressCard.defaultProps = {};

export default AddressCard;
