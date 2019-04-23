import gql from 'graphql-tag';

const UPDATE_PUSH_ID = gql`
  mutation updateUserPushSettings($input: PushSettingsInput!) {
    updateUserPushSettings(input: $input) {
      id
    }
  }
`;

const updatePushId = async ({ pushId, client }) => {
  await client.mutate({
    mutation: UPDATE_PUSH_ID,
    variables: { input: { pushProviderUserId: pushId } },
  });
};

export { updatePushId as default };
