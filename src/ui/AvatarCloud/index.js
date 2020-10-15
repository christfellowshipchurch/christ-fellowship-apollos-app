import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import {
  CenteredView,
  ConnectedImage,
  ImageSourceType,
  styled,
} from '@apollosproject/ui-kit';

const BlurWrapper = styled(
  ({ avatarWidth, order, getXYPositions }) => ({
    aspectRatio: 1,
    position: 'absolute',
    width: avatarWidth,
    zIndex: order,
    ...getXYPositions,
  }),
  'ui-kit.AvatarList.BlurWrapper'
)(View);

const CenteredAvatar = styled(
  ({ avatarWidth }) => ({
    aspectRatio: 1,
    borderRadius: 1000, // For simplicity we are just going to use a very large magic number 🙃🧙
    width: avatarWidth,
    zIndex: 100,
  }),
  'ui-kit.AvatarList.UserAvatar'
)(ConnectedImage);

const RandomAvatar = styled(
  {
    borderRadius: 1000, // For simplicity we are just going to use a very large magic number 🙃🧙
    aspectRatio: 1,
    width: '100%',
  },
  'ui-kit.AvatarList.RandomAvatar'
)(ConnectedImage);

class AvatarCloud extends PureComponent {
  static propTypes = {
    avatars: PropTypes.arrayOf(ImageSourceType).isRequired,
    blur: PropTypes.bool, // Weather or not to blur the "background" avatars. Defaults to true,
    isLoading: PropTypes.bool,
    maxAvatarWidth: PropTypes.number, // A percentage represented as a whole number (e.g. `0.5`) but pixel values will work too.
    minAvatarWidth: PropTypes.number, // A percentage represented as a whole number (e.g. `0.1`). It is not recommeded to go smaller than 0.1 (default)
    primaryAvatar: ImageSourceType, // The source to render a larger avatar at the center of the cloud
  };

  static defaultProps = {
    blur: false,
    maxAvatarWidth: 0.3,
    minAvatarWidth: 0.1,
  };

  constructor() {
    super();

    this.randomSeeds = {};
  }

  getAvatarPercentageWidth = (width) => `${width * 100}%`;

  getRandomAvatarMaxWidth() {
    return this.props.primaryAvatar
      ? /* we need some way to differentiate the largest possible `RandomAvatar`s from the
         * `primaryAvatar` so we subtract by a magic number that looks nice 🧙‍♂️ */
        this.props.maxAvatarWidth - 0.1
      : this.props.maxAvatarWidth;
  }

  getRandomPositionValue(seed) {
    if (!this.randomSeeds[seed]) this.randomSeeds[seed] = Math.random();
    return this.randomSeeds[seed];
  }

  getRandomAvatarSizes() {
    const sizes = this.props.avatars.map((avatar, i) => {
      const randomNumberInRange =
        this.getRandomPositionValue(i) *
          (this.getRandomAvatarMaxWidth() - this.props.minAvatarWidth) +
        this.props.minAvatarWidth;
      return Math.floor(randomNumberInRange * 10) / 10;
    });

    return sizes.sort((a, b) => a - b); // sort by decending order e.g. 1, 2, 3, 4
  }

  getRandomXYPositions(avatarSize, index) {
    // positionBoundry represents the viewable space for a given Avatar based on its size.
    const positionBoundry = 1 - avatarSize;
    const xyPositions = {
      left: this.getAvatarPercentageWidth(
        this.getRandomPositionValue(`${index}-x`) * positionBoundry
      ),
      top: this.getAvatarPercentageWidth(
        this.getRandomPositionValue(`${index}-y`) * positionBoundry
      ),
    };

    return xyPositions;
  }

  renderRandomAvatars() {
    return this.getRandomAvatarSizes().map((size, i, sizes) => (
      <BlurWrapper
        avatarWidth={this.getAvatarPercentageWidth(size)}
        getXYPositions={this.getRandomXYPositions(size, i)}
        key={`${
          typeof this.props.avatars[i] === 'string'
            ? this.props.avatars[i]
            : this.props.avatars[i].uri
        }${this.props.avatars[i].id ? this.props.avatars[i].id : i}`}
        order={i} // order = zIndex == higher index === "closer two the viewer/higher layer"
      >
        <RandomAvatar
          source={this.props.avatars[i]}
          isLoading={this.props.isLoading}
          blurRadius={this.props.blur ? sizes.length - i : 0}
        />
      </BlurWrapper>
    ));
  }

  render() {
    const {
      avatars,
      blur,
      isLoading,
      maxAvatarWidth,
      minAvatarWidth,
      primaryAvatar,
      ...props
    } = this.props;
    return (
      <CenteredView {...props}>
        {(isLoading || primaryAvatar) && (
          <CenteredAvatar
            avatarWidth={this.getAvatarPercentageWidth(maxAvatarWidth)}
            source={primaryAvatar}
            isLoading={isLoading}
          />
        )}
        {this.renderRandomAvatars()}
      </CenteredView>
    );
  }
}

export default AvatarCloud;
