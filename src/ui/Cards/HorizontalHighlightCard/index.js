import React from 'react';
import { Platform, View } from 'react-native';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import {
  withTheme,
  Card,
  CardImage,
  CardContent,
  H3,
  H6,
  Icon,
  withIsLoading,
  ConnectedImage,
  styled,
  FlexedView,
  ThemeMixin,
} from '@apollosproject/ui-kit';

import LiveLabel from '../../LiveLabel';
import BlurView from '../../BlurView';

const { ImageSourceType } = ConnectedImage;

const IMAGE_RATIOS = {
  default: 1,
  small: 1,
  medium: 150 / 225,
};

const BlurLabel = styled(({ theme, size }) => {
  const transform =
    size === 'small' || size === 'medium'
      ? {
          transform: [{ scale: 0.75 }, { translateX: -12 }, { translateY: 18 }],
        }
      : {};
  return {
    paddingHorizontal: theme.sizing.baseUnit * 0.5,
    paddingVertical: theme.sizing.baseUnit * 0.25,
    borderRadius: theme.sizing.baseBorderRadius * 0.5,
    left: theme.sizing.baseUnit * -0.25,
    ...transform,
  };
})(BlurView);

const Label = withTheme(({ theme }) => ({
  numberOfLines: 1,
  style: { color: theme.colors.white },
}))(H6);

const Title = withTheme(({ size, theme }) => {
  let sizeStyles = {};

  switch (size) {
    case 'small':
      sizeStyles = {
        numberOfLines: 3,
        style: {
          fontSize: theme.helpers.rem(0.875),
          lineHeight: theme.helpers.verticalRhythm(0.875),
        },
      };
      break;
    case 'medium':
      sizeStyles = {
        numberOfLines: 4,
        style: {
          fontSize: theme.helpers.rem(1),
          lineHeight: theme.helpers.verticalRhythm(1),
        },
      };
      break;
    default:
      sizeStyles = {
        numberOfLines: 4,
      };
      break;
  }

  return sizeStyles;
})(H3);

const SizedCard = styled(({ disabled, size }) => {
  let height = 240;
  let width = 240;

  switch (size) {
    case 'small':
      height = 150;
      width = 150;
      break;
    case 'medium':
      height = 225;
      width = 150;
      break;
    default:
      break;
  }

  return {
    width,
    height,
    // This hides/removes the built in shadow from `Card` if this component `disabled`.
    ...Platform.select({
      ios: {
        ...(disabled ? { shadowOpacity: 0 } : {}),
      },
      android: {
        ...(disabled ? { elevation: 0 } : {}),
      },
    }),
  };
}, 'ui-kit.HorizontalHighlightCard.SquareCard')(Card);

// We have to position `LikeIcon` in a `View` rather than `LikeIcon` directly so `LikeIcon`'s loading state is positioned correctly 💥
const LikeIconPositioning = styled(
  ({ theme }) => ({
    position: 'absolute',
    top: theme.sizing.baseUnit,
    right: theme.sizing.baseUnit,
  }),
  'ui-kit.HorizontalHighlightCard.LikeIconPositioning'
)(View);

const LikeIcon = withTheme(
  ({ theme, isLiked }) => ({
    name: isLiked ? 'like-solid' : 'like',
    size: theme.sizing.baseUnit * 1.5,
  }),
  'ui-kit.HorizontalHighlightCard.LikeIcon'
)(Icon);

const Image = withTheme(
  ({ customTheme, theme, disabled, size }) => ({
    minAspectRatio: IMAGE_RATIOS[size],
    maxAspectRatio: IMAGE_RATIOS[size],
    maintainAspectRatio: true,
    forceRatio: IMAGE_RATIOS[size], // fixes loading state
    overlayColor: disabled // There are effectively 3 conditions here for `overlayColor`.
      ? theme.colors.white // if `disabled` use white
      : get(customTheme, 'colors.primary', theme.colors.black), // else check for a custom theme (prop) or default to black.
    overlayType: disabled ? 'medium' : 'gradient-highlight-card',
  }),
  'ui-kit.HorizontalHighlightCard.Image'
)(CardImage);

const Content = styled(({ theme, size }) => {
  let paddingMultiplier = 1;

  if (size === 'small') paddingMultiplier = 0.75;
  if (size === 'medium') paddingMultiplier = 0.75;

  return {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignItems: 'flex-start', // needed to make `Label` display as an "inline" element
    paddingHorizontal: theme.sizing.baseUnit * paddingMultiplier, // TODO: refactor CardContent to have this be the default
    paddingBottom: theme.sizing.baseUnit * paddingMultiplier, // TODO: refactor CardContent to have this be the default
  };
}, 'ui-kit.HorizontalHighlightCard.Content')(CardContent);

const ActionLayout = styled(
  ({ theme }) => ({
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingTop: theme.sizing.baseUnit,
  }),
  'ui-kit.HorizontalHighlightCard.ActionLayout'
)(View);

const FlexedActionLayoutText = styled(
  ({ theme, hasAction }) => ({
    ...(hasAction ? { marginRight: theme.sizing.baseUnit } : {}), // spaces out text from `ActionIcon`. This has to live here for ActionIcon's loading state
  }),
  'ui-kit.HorizontalHighlightCard.FlexedActionLayoutText'
)(FlexedView);

const ActionIcon = withTheme(
  ({ theme }) => ({
    fill: theme.colors.text.primary,
    size: theme.sizing.baseUnit * 2,
  }),
  'ui-kit.HorizontalHighlightCard.ActionIcon'
)(Icon);

const renderLabel = ({ labelText, isLive, isLoading, size }) => {
  if (isLive || (labelText && labelText !== '' && !isLoading)) {
    const component = isLive ? (
      <LiveLabel BackgroundComponent={null} />
    ) : (
      <Label>{labelText}</Label>
    );
    const blurType = isLive ? 'thinMaterial' : 'ultraThinMaterial';
    return (
      <BlurLabel blurType={blurType} size={size}>
        {component}
      </BlurLabel>
    );
  }

  return null;
};

const HorizontalHighlightCard = withIsLoading(
  ({
    coverImage,
    title,
    actionIcon,
    hasAction,
    disabled,
    isLiked,
    isLoading,
    labelText,
    theme,
    isLive,
    size,
    ...props
  }) => (
    <ThemeMixin
      mixin={{
        // type: get(theme, 'type', 'dark').toLowerCase(), // not sure why we need toLowerCase
        colors: get(theme, 'colors', {}),
      }}
    >
      <SizedCard
        isLoading={isLoading}
        inHorizontalList
        disabled={disabled}
        size={size}
        {...props}
      >
        <Image
          customTheme={theme}
          source={coverImage}
          disabled={disabled}
          size={size}
        />
        <Content size={size}>
          {renderLabel({ isLive, labelText, isLoading, size })}
          <ActionLayout>
            <FlexedActionLayoutText hasAction={hasAction}>
              <Title size={size}>{title}</Title>
            </FlexedActionLayoutText>
            {hasAction ? (
              <ActionIcon name={actionIcon} isLoading={false} />
            ) : null}
          </ActionLayout>
        </Content>
        {isLiked != null ? (
          <LikeIconPositioning>
            <LikeIcon isLiked={isLiked} />
          </LikeIconPositioning>
        ) : null}
      </SizedCard>
    </ThemeMixin>
  )
);

HorizontalHighlightCard.propTypes = {
  coverImage: PropTypes.oneOfType([
    PropTypes.arrayOf(ImageSourceType),
    ImageSourceType,
  ]),
  title: PropTypes.string,
  actionIcon: PropTypes.string,
  hasAction: PropTypes.bool,
  disabled: PropTypes.bool, // "Disabled state". Alternatively use this to highlight/differentiate the "active" card in a list.
  isLiked: PropTypes.bool,
  labelText: PropTypes.string,
  theme: PropTypes.shape({
    type: PropTypes.string,
    colors: PropTypes.shape({}),
  }),
  size: PropTypes.oneOf(['small', 'medium', 'default']),
};

HorizontalHighlightCard.defaultProps = {
  actionIcon: 'play-opaque',
  theme: {
    type: 'dark',
    colors: {},
  },
  size: 'default',
};

export default HorizontalHighlightCard;
