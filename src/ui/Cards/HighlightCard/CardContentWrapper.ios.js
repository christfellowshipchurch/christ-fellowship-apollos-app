import React from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import { styled, CardImage, ConnectedImage } from '@apollosproject/ui-kit';
import { BlurView } from '@react-native-community/blur';

const { ImageSourceType } = ConnectedImage;

const BackgroundImage = styled(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
}))(CardImage);

const CardContentWrapper = ({ children, coverImage }) => (
  <View style={{ overflow: 'hidden' }}>
    <BackgroundImage source={coverImage} />
    <BlurView style={StyleSheet.absoluteFill} blurType="material" />
    {children}
  </View>
);

CardContentWrapper.propTypes = {
  coverImage: PropTypes.oneOfType([
    PropTypes.arrayOf(ImageSourceType),
    ImageSourceType,
  ]),
};

CardContentWrapper.displayName = 'CardContentWrapper';

export default CardContentWrapper;
