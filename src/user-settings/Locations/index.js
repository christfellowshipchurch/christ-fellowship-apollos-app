import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Query, Mutation } from 'react-apollo';
import { Dimensions } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { PaddedView, ButtonLink } from '@apollosproject/ui-kit';
import { get } from 'lodash';

import GET_CAMPUSES from './getCampusLocations';
import CHANGE_CAMPUS from './campusChange';
import MapView from './MapView';

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
    userLocation: {
      latitude: 39.104797,
      longitude: -84.511959,
    },
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
      () => null,
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }

  render() {
    const { navigation, onFinished } = this.props;
    // we should use the `onFinished` from the navigation param, if it exists.
    const handleFinished = navigation.getParam('onFinished', onFinished);
    return (
      <Query
        query={GET_CAMPUSES}
        variables={{
          latitude: this.state.userLocation.latitude,
          longitude: this.state.userLocation.longitude,
        }}
        fetchPolicy="cache-and-network"
      >
        {({ loading, error, data: { campuses = [], currentUser } = {} }) => (
          <Mutation mutation={CHANGE_CAMPUS}>
            {(handlePress) => (
              <MapView
                navigation={this.props.navigation}
                isLoading={loading}
                error={error}
                campuses={campuses}
                initialRegion={this.props.initialRegion}
                userLocation={this.state.userLocation}
                currentCampus={get(currentUser, 'profile.campus')}
                onLocationSelect={async ({ id }) => {
                  await handlePress({
                    variables: {
                      campusId: id,
                    },
                  });
                  await navigation.goBack();
                  if (handleFinished) handleFinished();
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
