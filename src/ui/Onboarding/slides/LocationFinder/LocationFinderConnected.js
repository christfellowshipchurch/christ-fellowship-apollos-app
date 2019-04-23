import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { withNavigation } from 'react-navigation';
import getUserCampus from './getUserCampus';
import LocationFinder from '.';

class LocationFinderConnected extends PureComponent {
  state = { selectedCampus: false };

  render() {
    return (
      <Query query={getUserCampus} fetchPolicy="cache-and-network">
        {({
          data: {
            currentUser: {
              profile: { campus } = {
                campus: {},
              },
            } = {},
          } = {},
        }) => (
          <LocationFinder
            onPressButton={async () => {
              this.setState({ selectedCampus: true });
              this.props.navigation.navigate('LocationFinderMapView', {
                onFinished: this.props.onPressPrimary,
              });
            }}
            buttonText={'Yes, find my local campus'}
            campus={this.state.selectedCampus ? campus : null}
            onPressPrimary={this.props.onPressPrimary}
            {...this.props}
          />
        )}
      </Query>
    );
  }
}

LocationFinderConnected.propTypes = {
  onPressPrimary: PropTypes.func.isRequired,
};

LocationFinderConnected.displayName = 'LocationFinderConnected';

export default withNavigation(LocationFinderConnected);
