import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Animated } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import RNMapView from 'react-native-maps';
import { debounce } from 'lodash';

import {
  Button,
  PaddedView,
  FlexedView,
  styled,
  withTheme,
  CampusCard,
} from '@apollosproject/ui-kit';

import Marker from './Marker';

const { CARD_WIDTH } = CampusCard;

const FlexedMapView = styled({ flex: 1 })(({ mapRef, ...props }) => (
  <RNMapView ref={mapRef} {...props} />
));

const getCampusAddress = (campus) =>
  `${campus.street1}\n${campus.city}, ${campus.state} ${campus.postalCode}`;

const Footer = styled({
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
    if (!campus) {
      this.map.fitToCoordinates(
        [...this.props.campuses, this.props.userLocation],
        {
          edgePadding: {
            top: 100,
            left: 100,
            right: 100,
            // This is higher to avoid the campus cards (baseUnit * 6) on the bottom
            bottom: 100 + this.props.theme.sizing.baseUnit * 12,
          },
        }
      );
      return;
    }

    const { userLocation } = this.props;
    this.map.fitToCoordinates([campus, userLocation], {
      edgePadding: {
        top: 100,
        left: 100,
        right: 100,
        // This is higher to avoid the campus cards (baseUnit * 6) on the bottom
        bottom: 100 + this.props.theme.sizing.baseUnit * 12,
      },
    });
  };

  render() {
    const { campuses = [], onLocationSelect } = this.props;
    const interpolations = campuses.map((marker, index) => {
      const inputRange = [
        (index - 1) * CARD_WIDTH,
        index * CARD_WIDTH,
        (index + 1) * CARD_WIDTH,
      ];
      const opacity = this.animation.interpolate({
        inputRange,
        outputRange: [0.35, 1, 0.35],
        extrapolate: 'clamp',
      });
      return { opacity };
    });

    return (
      <FlexedView>
        <FlexedMapView
          initialRegion={this.props.initialRegion}
          showsUserLocation
          mapRef={(map) => {
            this.map = map;
          }}
        >
          {campuses.map((campus, index) => {
            const campusOpacity = {
              opacity: interpolations[index].opacity,
            };
            return (
              <Marker
                key={campus.id}
                opacityStyle={campusOpacity}
                latitude={campus.latitude}
                longitude={campus.longitude}
              />
            );
          })}
        </FlexedMapView>
        <Footer>
          <SafeAreaView>
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
        </Footer>
      </FlexedView>
    );
  }
}

export default withTheme()(MapView);
