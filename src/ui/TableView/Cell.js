import React from 'react';
import {
  FlexedView,
  Touchable,
  H5,
  styled,
  withTheme,
  Icon,
} from '@apollosproject/ui-kit';

const PaddedRow = styled(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: theme.sizing.baseUnit * 0.75,
  paddingHorizontal: theme.sizing.baseUnit,
}))(FlexedView);

const Title = styled(({ theme }) => ({
  flex: 4,
  fontWeight: 'normal',
}))(H5);

const CellIcon = withTheme(({ theme }) => ({
  size: 18,
  fill: theme.colors.text.tertiary,
  style: {
    marginRight: theme.sizing.baseUnit * 0.5,
  },
}))(Icon);

const Cell = ({ title, icon, onPress }) => (
  <Touchable onPress={onPress}>
    <PaddedRow>
      {!!icon && icon !== '' && <CellIcon name={icon} />}
      <Title>{title}</Title>
    </PaddedRow>
  </Touchable>
);

Cell.defaultProps = {
  icon: null,
  title: 'Cell Title',
  onPress: () => null,
};

export default Cell;
