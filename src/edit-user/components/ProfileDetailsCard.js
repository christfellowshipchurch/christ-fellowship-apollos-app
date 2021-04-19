/**
 * ProfileDetailsCard.js
 *
 * Author: Caleb Panza
 * Created: Apr 09, 2021
 *
 * Shows the current user's address wrapped in a Card
 */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigation } from '@react-navigation/native';
import { parseISO, format } from 'date-fns';
import { useCurrentUser } from 'hooks';

import { View } from 'react-native';
import { UIText, H4, styled } from '@apollosproject/ui-kit';
import UserDataCard from './UserDataCard';

// :: Styles
// :: ============================
const VerticalPadding = styled(({ theme }) => ({
  paddingVertical: theme.sizing.baseUnit * 0.5,
}))(View);

const ProfileDetailsCard = () => {
  const navigation = useNavigation();
  const { gender, birthDate } = useCurrentUser();
  const [birthDateLabel, setBirthDateLabel] = useState('');

  const action = () => navigation.navigate('EditProfileDetails');

  useEffect(
    () => {
      if (birthDate) {
        try {
          const parsedStr = parseISO(birthDate);
          const friendly = format(parsedStr, 'MMM do, y');
          setBirthDateLabel(friendly);
        } catch {}
      }
    },
    [birthDate]
  );

  return (
    <UserDataCard icon="avatar">
      <UIText>{'Gender'}</UIText>
      <H4>{gender}</H4>
      <VerticalPadding />
      <UIText>{'Birthday'}</UIText>
      <H4>{birthDateLabel}</H4>
    </UserDataCard>
  );
};

ProfileDetailsCard.propTypes = {};
ProfileDetailsCard.defaultProps = {};

export default ProfileDetailsCard;
