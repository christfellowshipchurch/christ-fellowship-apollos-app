import { Client, Configuration } from 'bugsnag-react-native';
import gql from 'graphql-tag';
import Config from 'react-native-config';
import { onError } from 'apollo-link-error';

const getUser = async (client) => {
  let user;
  try {
    const {
      currentUser: { id },
    } = await client.readQuery({
      query: gql`
        {
          currentUser {
            id
          }
        }
      `,
    });
    user = { id };
  } catch (e) {
    user = { id: null };
  }
  return user;
};

const configuration = new Configuration();
configuration.apiKey = Config.BUGSNAG_KEY;
const bugsnag = new Client(configuration);

// set the user
const setUser = async (client) => {
  const user = await getUser(client);
  bugsnag.setUser(user.id);
};

const bugsnagLink = onError(({ graphQLErrors, networkError, operation }) => {
  const { headers: { authorization: token } = {} } = operation.getContext();
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      bugsnag.notify(new Error(message), (report) => {
        if (operation.variables && operation.variables.password) {
          // eslint-disable-next-line
          delete operation.variables.password;
        }
        if (path) {
          // eslint-disable-next-line
          report.context = path.join('/');
        }
        // eslint-disable-next-line
        report.metadata = {
          path,
          locations,
          operation,
          // NOTE: this should be removed once we have resolved the
          // frequent authentication errors
          token,
        };
      });
    });
  }
  if (networkError) bugsnag.notify(networkError);
});

export { bugsnag as default, bugsnagLink, setUser };
