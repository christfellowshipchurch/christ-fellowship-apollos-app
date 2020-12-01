import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

import {
  H5,
  BodySmall,
  styled,
  withTheme,
  TouchableScale,
  ImageSourceType,
  FlexedView,
  Icon,
} from '@apollosproject/ui-kit';

import ActionListImage from '@apollosproject/ui-kit/src/ActionList/ActionListItem/ActionListImage';

const ImagePosition = styled(({ theme }) => ({
  alignItems: 'center',
  justifyContent: 'center',
}))(View);

/**
 * ActionListImage uses a margin to the right to position itself relative to the rest
 * of the content making it tricky to just position it centered, so we'll just mimic
 * the exact same height/width of the image itself
 */
const IconPosition = withTheme(({ theme }) => ({
  position: 'absolute',
  alignItems: 'center',
  justifyContent: 'center',
  top: 0,
  left: 0,
  width: theme.sizing.baseUnit * 4,
  height: theme.sizing.baseUnit * 4,
}))(View);

const StyledIcon = withTheme(({ theme }) => ({
  fill: theme.colors.white,
  size: 26,
}))(Icon);

const Label = styled(
  ({ theme }) => ({
    color: theme.colors.text.tertiary,
  }),
  'ui-kit.ActionList.ActionListItem.Label'
)(BodySmall);

const TextContainer = styled(
  {
    justifyContent: 'center',
  },
  'ui-kit.ActionList.ActionListItem.TextContainer'
)(FlexedView);

const Cell = styled(
  ({ theme }) => ({
    paddingBottom: theme.sizing.baseUnit * 0.5,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  }),
  'ui-kit.ActionList.ActionListItem.Cell'
)(View);

// eslint-disable-next-line react/prop-types
const RenderAsTouchable = ({ children, onPress }) =>
  onPress ? (
    <TouchableScale onPress={onPress}>{children}</TouchableScale>
  ) : (
    children
  );

const ActionListItem = ({ imageSource, title, label, onPress, icon }) => (
  <RenderAsTouchable onPress={onPress}>
    <Cell>
      <ImagePosition>
        <ActionListImage source={imageSource} />
        {icon && (
          <IconPosition>
            <StyledIcon name={icon} />
          </IconPosition>
        )}
      </ImagePosition>

      <TextContainer>
        {title ? <H5 numberOfLines={!label ? 2 : 1}>{title}</H5> : null}
        {label ? (
          <Label numberOfLines={!title ? 3 : 2} ellipsizeMode="tail">
            {label}
          </Label>
        ) : null}
      </TextContainer>
    </Cell>
  </RenderAsTouchable>
);

ActionListItem.propTypes = {
  imageSource: ImageSourceType,
  title: PropTypes.string,
  label: PropTypes.string,
  onPress: PropTypes.func,
  icon: PropTypes.string,
};

export default ActionListItem;
