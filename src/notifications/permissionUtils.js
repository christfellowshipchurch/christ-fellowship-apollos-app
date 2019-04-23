import OneSignal from 'react-native-onesignal';
import gql from 'graphql-tag';

const getPushPermissions = async () =>
  new Promise((resolve) =>
    OneSignal.getPermissionSubscriptionState((status) =>
      // Ensure the client (notificationsEnabled) && OneSignal (subscriptionEnabled) are boolean values
      resolve(!!(status.notificationsEnabled && status.subscriptionEnabled))
    )
  );

const promptForPushNotificationsWithUserResponse = async () =>
  new Promise((resolve) =>
    OneSignal.promptForPushNotificationsWithUserResponse(resolve)
  );

const setNotifcationsEnabled = gql`
  mutation updatePushPermissions($enabled: Boolean!) {
    updatePushPermissions(enabled: $enabled) @client
  }
`;

const getNotificationsEnabled = gql`
  query getPushPermissions {
    notificationsEnabled @client(always: true)
  }
`;

const requestPushPermissions = async ({ client }) => {
  const notificationsEnabled = await promptForPushNotificationsWithUserResponse();
  await client.mutate({
    mutation: setNotifcationsEnabled,
    variables: { enabled: notificationsEnabled },
  });

  return notificationsEnabled;
};

export { getPushPermissions, requestPushPermissions, getNotificationsEnabled };
