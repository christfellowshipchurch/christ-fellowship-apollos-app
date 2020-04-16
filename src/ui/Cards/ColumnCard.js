import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

import {
  H5,
  H6,
  styled,
  withTheme,
  withIsLoading,
  ConnectedImage,
  FlexedView,
  CardImage,
  Card,
} from '@apollosproject/ui-kit';
import { BlurView } from '@react-native-community/blur';
import ThemeMixin from '../DynamicThemeMixin';
import { Summary } from './components';

const { ImageSourceType } = ConnectedImage;

const ImageContainer = styled(({ theme }) => ({
  width: '100%',
  overflow: 'hidden',
  marginRight: theme.sizing.baseUnit,
}))(View);

const Image = withTheme(({ theme, label }) => ({
  ...(!!label && label !== ''
    ? {
      overlayColor: theme.colors.black,
      overlayType: 'gradient-bottom-short',
    }
    : {}),
  // Sets the ratio of the image
  minAspectRatio: 1.33,
  maxAspectRatio: 1.33,
  // Sets the ratio of the placeholder
  forceRatio: 1.33,
  // No ratios are respected without this
  maintainAspectRatio: true,
}))(CardImage);

const Title = styled(({ theme }) => ({
  fontWeight: 'bold',
  color: theme.colors.text.primary,
}))(H5);

const Content = styled(({ theme }) => ({
  padding: theme.sizing.baseUnit * 0.75,
  justifyContent: 'center',
  backgroundColor: theme.colors.background.paper,
}))(FlexedView);

const BlurLabel = styled(({ theme }) => ({
  position: 'absolute',
  bottom: 12,
  left: 10,
  padding: theme.sizing.baseUnit * 0.5,
  borderRadius: theme.sizing.baseBorderRadius,
}))(BlurView);

const Label = styled(({ theme }) => ({
  color: theme.colors.white,
}))(H6);

const CardWithLayout = styled(({ theme, placement }) => ({
  marginLeft: theme.sizing.baseUnit * (placement === 'right' ? 0.5 : 1),
  marginRight: theme.sizing.baseUnit * (placement === 'left' ? 0.5 : 1),
  flex: 1,
}))(Card);

const StackedImageCard = ({ placement, coverImage, label, title, summary }) => (
  <ThemeMixin>
    <CardWithLayout placement={placement}>
      <ImageContainer>
        <Image source={coverImage} isLoading label={label} />
        {label !== '' && (
          <BlurLabel blurType="ultraThinMaterial">
            <Label>{label}</Label>
          </BlurLabel>
        )}
      </ImageContainer>
      <Content>
        {title !== '' && (
          <Title numberOfLines={2} ellipsizeMode="tail">
            {title}
          </Title>
        )}
        {summary !== '' && <Summary>{summary}</Summary>}
      </Content>
    </CardWithLayout>
  </ThemeMixin>
);

StackedImageCard.propTypes = {
  onPress: PropTypes.func,
  coverImage: PropTypes.oneOfType([
    PropTypes.arrayOf(ImageSourceType),
    ImageSourceType,
  ]),
  label: PropTypes.string,
  summary: PropTypes.string,
  title: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  placement: PropTypes.oneOf(['', 'left', 'right']),
};

export default withIsLoading(StackedImageCard);
