import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Query, Mutation } from 'react-apollo';
import { Dimensions } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import MapView from '@apollosproject/ui-mapview';
import { PaddedView, ButtonLink } from '@apollosproject/ui-kit';
import { get } from 'lodash';

import GET_CAMPUSES from './getCampusLocations';
import CHANGE_CAMPUS from './campusChange';

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
  };

  static defaultProps = {
    initialRegion: {
      // roughly show the entire USA by default
      latitude: 39.809734,
      longitude: -98.555618,
      latitudeDelta: 100,
      longitudeDelta:
        (100 * Dimensions.get('window').width) /
        Dimensions.get('window').height,
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
    userLocation: null,
  };

  async componentDidMount() {
    Geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          userLocation: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
        });
      },
      (e) => console.warn('Error getting location!', e),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }

  render() {
    return (
      <Query
        query={GET_CAMPUSES}
        variables={{
          latitude: get(this.state, 'userLocation.latitude'),
          longitude: get(this.state, 'userLocation.longitude'),
        }}
        fetchPolicy="cache-and-network"
      >
        {({ loading, error, data: { campuses, currentUser } = {} }) => {
          console.log({ campuses, currentUser });

          return (
            <Mutation mutation={CHANGE_CAMPUS}>
              {(handlePress) => (
                <MapView
                  navigation={this.props.navigation}
                  isLoading={loading}
                  error={error}
                  campuses={campuses || []}
                  initialRegion={this.props.initialRegion}
                  userLocation={this.state.userLocation}
                  currentCampus={get(currentUser, 'profile.campus')}
                  onLocationSelect={async (campus) => {
                    handlePress({
                      variables: {
                        campusId: campus.id,
                      },
                      optimisticResponse: {
                        updateUserCampus: {
                          __typename: 'Mutation',
                          id: currentUser.id,
                          campus,
                        },
                      },
                    });
                    this.props.navigation.goBack();
                  }}
                />
              )}
            </Mutation>
          );
        }}
      </Query>
    );
  }
}

export default Location;
