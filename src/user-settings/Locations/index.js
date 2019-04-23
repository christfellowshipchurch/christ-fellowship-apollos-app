import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Query, Mutation } from 'react-apollo';
import { Dimensions } from 'react-native';

import { PaddedView, ButtonLink } from '@apollosproject/ui-kit';

import getUserProfile from '../../tabs/connect/getUserProfile';
import MapView from './MapView';

import getAllCampuses from './getCampusLocations';

import campusChange from './campusChange';

const getCurrentLocation = () =>
  new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position),
      (e) => reject(e)
    );
  });

const screen = Dimensions.get('window');

const ASPECT_RATIO = screen.width / screen.height;

class Location extends PureComponent {
  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
      navigate: PropTypes.func,
      goBack: PropTypes.func,
    }),
    initialRegion: PropTypes.shape({
      latitude: PropTypes.number,
      longitude: PropTypes.number,
      latitudeDelta: PropTypes.number,
      longitudeDelta: PropTypes.number,
    }),
    onFinished: PropTypes.func,
  };

  static defaultProps = {
    initialRegion: {
      // roughly show the entire USA by default
      latitude: 39.809734,
      longitude: -98.555618,
      latitudeDelta: 100,
      longitudeDelta: 100 * ASPECT_RATIO,
    },
  };

  static navigationOptions = ({ navigation }) => ({
    title: 'Location',
    headerLeft: null,
    headerRight: (
      <PaddedView vertical={false}>
        <ButtonLink onPress={() => navigation.goBack()}>Back</ButtonLink>
      </PaddedView>
    ),
  });

  state = {
    region: this.props.initialRegion,
  };

  componentDidMount() {
    return getCurrentLocation().then((position) => {
      if (position) {
        this.setState({
          userLocation: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
        });
      }
    });
  }

  render() {
    const { navigation, onFinished } = this.props;
    return (
      <Query
        query={getAllCampuses}
        variables={{
          latitude: this.state.region.latitude,
          longitude: this.state.region.longitude,
        }}
        fetchPolicy="cache-and-network"
      >
        {({ loading, error, data: { campuses = [] } = {} }) => (
          <Mutation
            mutation={campusChange}
            update={async (cache, { data: { updateUserCampus } }) => {
              const { currentUser } = await cache.readQuery({
                query: getUserProfile,
              });
              await cache.writeQuery({
                query: getUserProfile,
                data: {
                  currentUser: {
                    ...currentUser,
                    profile: {
                      ...currentUser.profile,
                      campus: {
                        ...updateUserCampus.campus,
                      },
                    },
                  },
                },
              });
            }}
          >
            {(handlePress) => (
              <MapView
                navigation={navigation}
                isLoading={loading}
                error={error}
                campuses={campuses}
                initialRegion={this.props.initialRegion}
                userLocation={this.state.userLocation}
                onLocationSelect={async ({ id }) => {
                  await handlePress({
                    variables: {
                      campusId: id,
                    },
                  });
                  await navigation.goBack();
                  if (onFinished) onFinished();
                }}
              />
            )}
          </Mutation>
        )}
      </Query>
    );
  }
}

export default Location;
