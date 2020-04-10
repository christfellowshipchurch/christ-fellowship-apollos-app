import React, { PureComponent } from 'react';
import { View, Platform, Text } from 'react-native';
import PropTypes from 'prop-types';

import {
  H5,
  H6,
  styled,
  withTheme,
  withIsLoading,
  ConnectedImage,
  FlexedView,
  CardLabel,
  CardImage,
  Card,
} from '@apollosproject/ui-kit';
import { BlurView } from '@react-native-community/blur';
import ThemeMixin from '../DynamicThemeMixin';

const { ImageSourceType } = ConnectedImage;

const ImageContainer = styled(({ theme }) => ({
  width: '100%',
  overflow: 'hidden',
  marginRight: theme.sizing.baseUnit,
}))(View);

const Image = withTheme(({ theme, isLoading, label }) => ({
  overlayColor:
    !!label && label !== '' ? theme.colors.black : theme.colors.transparent,
  minAspectRatio: 1,
  maxAspectRatio: 1,
}))(CardImage);

const Summary = styled(({ theme }) => ({
  color: theme.colors.text.secondary,
}))(H6);

const Title = styled(({ theme }) => ({
  fontWeight: 'bold',
  color: theme.colors.text.primary,
}))(Text);

const Content = styled(({ theme }) => ({
  padding: theme.sizing.baseUnit * 0.75,
  justifyContent: 'center',
  backgroundColor: theme.colors.background.paper,
}))(FlexedView);

const StyledCardLabel = styled(({ theme }) => ({
  position: 'absolute',
  bottom: 12,
  left: 10,
}))(CardLabel);

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

const Layout = styled(({ theme, placement }) => ({
  marginLeft: -theme.sizing.baseUnit * (placement === 'right' ? 0.25 : 0),
  marginRight: -theme.sizing.baseUnit * (placement === 'left' ? 0.25 : 0),
  marginVertical: theme.sizing.baseUnit * 0.25,
}))(View);

const StackedImageCard = ({ placement, coverImage, label, title, summary }) => (
  <ThemeMixin>
    <Layout placement={placement}>
      <Card>
        <ImageContainer>
          <Image source={coverImage} isLoading label={label} />
          {/* <StyledCardLabel title={label} /> */}
          <BlurLabel blurType="ultraThinMaterial">
            <Label>{label}</Label>
          </BlurLabel>
        </ImageContainer>
        <Content>
          {title !== '' && (
            <Title numberOfLines={2} ellipsizeMode="tail">
              {title}
            </Title>
          )}

          {summary !== '' && (
            <Summary numberOfLines={2} ellipsizeMode="tail">
              {summary}
            </Summary>
          )}
        </Content>
      </Card>
    </Layout>
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
