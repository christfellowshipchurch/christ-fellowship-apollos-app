import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import MapView from 'ChristFellowship/src/user-settings/Locations';

class LocationFinderMapView extends PureComponent {
  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
      navigate: PropTypes.func,
      goBack: PropTypes.func,
    }),
  };

  static navigationOptions = () => ({
    title: 'LocationFinderMapView',
    header: null,
  });

  render() {
    const { navigation } = this.props;
    const onFinished = this.props.navigation.getParam('onFinished');
    return <MapView navigation={navigation} onFinished={onFinished} />;
  }
}

export default LocationFinderMapView;
