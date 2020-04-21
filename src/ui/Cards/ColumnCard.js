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
import BlurView from '../BlurView';
import ThemeMixin from '../DynamicThemeMixin';
import LiveLabel from '../LiveLabel';
import { Summary } from './components';

const { ImageSourceType } = ConnectedImage;

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

const LiveLabelPositioning = styled(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: theme.sizing.baseUnit * 0.75,
}))(LiveLabel);

const BlurLabel = styled(({ theme }) => ({
  padding: theme.sizing.baseUnit * 0.5,
  borderRadius: theme.sizing.baseBorderRadius,
  position: 'absolute',
  bottom: 0,
  left: theme.sizing.baseUnit * 0.75 - theme.sizing.baseUnit * 0.5,
}))(BlurView);

const Label = withTheme(({ theme }) => ({
  numberOfLines: 1,
  style: { color: theme.colors.white },
}))(H6);

const CardWithLayout = styled(({ theme, placement }) => ({
  marginLeft: theme.sizing.baseUnit * (placement === 'right' ? 0.5 : 1),
  marginRight: theme.sizing.baseUnit * (placement === 'left' ? 0.5 : 1),
  flex: 1,
}))(Card);

const StackedImageCard = ({
  placement,
  coverImage,
  label,
  title,
  summary,
  isLive,
  isLoading,
}) => (
    <ThemeMixin>
      <CardWithLayout placement={placement}>
        <View>
          <Image source={coverImage} isLoading label={label} />
          {isLive && <LiveLabelPositioning BackgroundComponent={BlurView} />}

          {label !== '' &&
            !isLive &&
            !isLoading && (
              <BlurLabel blurType="ultraThinMaterial">
                <Label isLoading={isLoading}>{label}</Label>
              </BlurLabel>
            )}
        </View>
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
  coverImage: PropTypes.oneOfType([
    PropTypes.arrayOf(ImageSourceType),
    ImageSourceType,
  ]),
  label: PropTypes.string,
  summary: PropTypes.string,
  title: PropTypes.string,
  placement: PropTypes.oneOf(['', 'left', 'right']),
  isLive: PropTypes.bool,
  isLoading: PropTypes.bool,
};

export default withIsLoading(StackedImageCard);
