/**
 * CommunicationPreferencesCard.js
 *
 * Author: Caleb Panza
 * Created: Apr 09, 2021
 *
 * Shows the current user's campus wrapped in a Card
 */

import React from 'react';
import { useCurrentUser } from 'hooks';

import { Switch } from 'ui/inputs';
import UpdatePushNotification from './UpdatePushNotification';
import UserDataCard from './UserDataCard';

const CommunicationPreferencesCard = () => {
  const {
    phoneNumber,
    email,
    communicationPreferences,
    updateCommunicationPreference,
    loading,
  } = useCurrentUser();

  return (
    <UserDataCard icon="bell">
      <UpdatePushNotification />
      {!!phoneNumber &&
        phoneNumber !== '' && (
          <Switch
            label={`Allow Text Notifications`}
            value={communicationPreferences?.allowSMS}
            disabled={loading}
            onValueChange={(value) => {
              updateCommunicationPreference({
                variables: { type: 'SMS', allow: value },
              });
            }}
          />
        )}

      {!!email &&
        email !== '' && (
          <Switch
            label={`Allow Email Notifications`}
            value={communicationPreferences?.allowEmail}
            disabled={loading}
            onValueChange={(value) => {
              updateCommunicationPreference({
                variables: { type: 'Email', allow: value },
              });
            }}
          />
        )}
    </UserDataCard>
  );
};

CommunicationPreferencesCard.propTypes = {};
CommunicationPreferencesCard.defaultProps = {};

export default CommunicationPreferencesCard;
