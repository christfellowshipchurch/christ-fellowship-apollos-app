import amplitude from 'amplitude-js';
import Config from 'react-native-config';
import gql from 'graphql-tag';
import { get } from 'lodash';
import { getVersion } from 'react-native-device-info';
import { client } from './client';

amplitude.getInstance().init(Config.AMPLITUDE_KEY, null, {
  useNativeDeviceInfo: true,
});

export const track = ({ eventName, properties = null }) => {
  amplitude
    .getInstance()
    .logEvent(eventName, properties, (...args) => console.log(args));
};

export const identify = () => {
  const data = client.readQuery({
    query: gql`
      query currentCampusId {
        currentUser {
          id
          profile {
            id
            campus {
              id
              name
            }
          }
        }
      }
    `,
  });

  const userProperties = {
    campusName: get(data, 'currentUser.profile.campus.name'),
    appVersion: getVersion(),
  };

  amplitude.getInstance().setUserId(get(data, 'currentUser.profile.id'));

  amplitude.getInstance().setUserProperties(userProperties);
};
