import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Animated } from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import RNMapView from 'react-native-maps';
import { debounce } from 'lodash';

import { Button, PaddedView, styled, withTheme } from '@apollosproject/ui-kit';

import CampusCard, { CARD_WIDTH } from './CampusCard';
import Marker from './Marker';

const ContainerView = styled({
  flex: 1,
})(View);

const FlexedMapView = styled({ flex: 1 })(({ mapRef, ...props }) => (
  <RNMapView ref={mapRef} {...props} />
));

const getCampusAddress = (campus) =>
  `${campus.street1}\n${campus.city}, ${campus.state} ${campus.postalCode}`;

const ScrollingView = styled({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
})(View);

class MapView extends Component {
  static propTypes = {
    campuses: PropTypes.arrayOf(
      PropTypes.shape({
        latitude: PropTypes.number.isRequired,
        longitude: PropTypes.number.isRequired,
      })
    ),
    onLocationSelect: PropTypes.func.isRequired,
    initialRegion: PropTypes.shape({
      latitude: PropTypes.number.isRequired,
      longitude: PropTypes.number.isRequired,
      latitudeDelta: PropTypes.number,
      longitudeDelta: PropTypes.number,
    }).isRequired,
    userLocation: PropTypes.shape({
      latitude: PropTypes.number.isRequired,
      longitude: PropTypes.number.isRequired,
    }),
    theme: PropTypes.shape({
      sizing: PropTypes.shape({
        baseUnit: PropTypes.number,
      }),
    }),
    navigation: PropTypes.shape({
      goBack: PropTypes.func,
    }),
  };

  state = {
    campus: null,
  };

  animation = new Animated.Value(0);

  componentDidMount() {
    this.animation.addListener(debounce(this.updateCoordinates));
  }

  componentDidUpdate(oldProps) {
    if (oldProps.userLocation !== this.props.userLocation) {
      this.updateCoordinates({ value: this.previousScrollPosition });
    }
  }

  get contentContainerStyle() {
    return { paddingHorizontal: this.props.theme.sizing.baseUnit * 0.75 }; // pad cards from edge of screen but account for card margin
  }

  updateCoordinates = ({ value }) => {
    this.previousScrollPosition = value;
    const cardIndex = Math.floor(value / CARD_WIDTH + 0.3); // animate 30% away from landing on the next item;
    const campus = this.props.campuses[cardIndex];
    this.setState({ campus });
    if (!campus) return;

    const { userLocation } = this.props;

    let { latitude } = campus;
    const { longitude } = campus;
    let { latitudeDelta, longitudeDelta } = this.props.initialRegion;

    if (userLocation) {
      // Calculate rectangle that shows user's location in the view with campus at center
      const minLat = Math.min(campus.latitude, userLocation.latitude);
      const maxLat = Math.max(campus.latitude, userLocation.latitude);
      const minLong = Math.min(campus.longitude, userLocation.longitude);
      const mayLong = Math.max(campus.longitude, userLocation.longitude);

      latitudeDelta = (maxLat - minLat) * 2.5;
      longitudeDelta = (mayLong - minLong) * 2.5;
    }

    // Now, we need to transform the given lat/lng/delta up to make room for cards at bottom.
    // To make this math simpler, we'll assume the cards take up roughly 20% of the vertical space
    const maxDelta = Math.max(latitudeDelta, longitudeDelta);
    latitude -= maxDelta * 0.2; // move the view up 20%
    latitudeDelta *= 1.2; // include 20% more area in the view

    this.map.animateToRegion(
      {
        latitude,
        longitude,
        latitudeDelta,
        longitudeDelta,
      },
      350
    );
  };

  render() {
    const { campuses = [], onLocationSelect } = this.props;
    const interpolations = campuses.map((marker, index) => {
      const inputRange = [
        (index - 1) * CARD_WIDTH,
        index * CARD_WIDTH,
        (index + 1) * CARD_WIDTH,
      ];
      const scale = this.animation.interpolate({
        inputRange,
        outputRange: [1, 2.5, 1],
        extrapolate: 'clamp',
      });
      const opacity = this.animation.interpolate({
        inputRange,
        outputRange: [0.35, 1, 0.35],
        extrapolate: 'clamp',
      });
      return { scale, opacity };
    });

    return (
      <ContainerView>
        <ContainerView>
          <FlexedMapView
            initialRegion={this.props.initialRegion}
            showsUserLocation
            mapRef={(map) => {
              this.map = map;
            }}
          >
            {campuses.map((campus, index) => {
              const scaleStyle = {
                transform: [
                  {
                    scale: interpolations[index].scale,
                  },
                ],
              };
              const opacityStyle = {
                opacity: interpolations[index].opacity,
              };
              return (
                <Marker
                  key={campus.id}
                  opacityStyle={opacityStyle}
                  scaleStyle={scaleStyle}
                  latitude={campus.latitude}
                  longitude={campus.longitude}
                />
              );
            })}
          </FlexedMapView>
          <ScrollingView>
            <SafeAreaView forceInset={{ bottom: 'always', top: 'never' }}>
              <Animated.ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={CARD_WIDTH + 8} // account for padding
                snapToAlignment={'start'}
                decelerationRate={'fast'}
                contentContainerStyle={this.contentContainerStyle} // correctly pads cards in ScrollView
                scrollEventThrottle={16} // roughtly 1000ms/60fps = 16ms
                onScroll={Animated.event(
                  [
                    {
                      nativeEvent: {
                        contentOffset: {
                          x: this.animation,
                        },
                      },
                    },
                  ],
                  { useNativeDriver: true }
                )}
              >
                {campuses.map((campus) => (
                  <CampusCard
                    key={campus.id}
                    distance={campus.distanceFromLocation}
                    title={campus.name}
                    description={getCampusAddress(campus)}
                    images={[campus.image]}
                  />
                ))}
              </Animated.ScrollView>
              <PaddedView>
                <Button
                  title="Select Campus"
                  pill={false}
                  type="secondary"
                  onPress={() =>
                    onLocationSelect(this.state.campus || campuses[0])
                  }
                />
              </PaddedView>
            </SafeAreaView>
          </ScrollingView>
        </ContainerView>
      </ContainerView>
    );
  }
}

export default withTheme()(MapView);
