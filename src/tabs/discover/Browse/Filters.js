import React from 'react';
import { View, FlatList } from 'react-native';
import PropTypes from 'prop-types';
import Color from 'color';

import { Touchable, H6, styled } from '@apollosproject/ui-kit';

import { lightenBy, darkenBy } from 'utils/theme';

const EndCapSpacer = styled(({ theme }) => ({
  width: theme.sizing.baseUnit * 0.5,
}))(View);

const Container = styled(({ theme, active }) => ({
  paddingTop: theme.sizing.baseUnit,
  paddingBottom: theme.sizing.baseUnit * 0.5,
}))(View);

const StyledH5 = styled(({ theme, active }) => {
  let borderColor = theme.colors.primary;

  if (!active) {
    const screen = theme.colors.background.screen;
    borderColor = Color(screen).isDark()
      ? lightenBy(screen, 0.25)
      : darkenBy(screen, 0.05);
  }

  return {
    color: active ? theme.colors.white : theme.colors.text.secondary,
    fontWeight: active ? 'bold' : 'normal',
    letterSpacing: 1,
    lineHeight: theme.helpers.verticalRhythm(0.5),
    marginHorizontal: theme.sizing.baseUnit * 0.25,
    backgroundColor: active
      ? theme.colors.primary
      : theme.colors.background.screen,
    paddingVertical: theme.sizing.baseUnit * 0.5,
    paddingHorizontal: theme.sizing.baseUnit,
    borderRadius: theme.sizing.baseBorderRadius,
    borderWidth: 1,
    borderColor,
  };
})(H6);

const LoadingStateContainer = styled(({ theme }) => ({
  flexDirection: 'row',
  paddingVertical: theme.sizing.baseUnit,
  paddingLeft: theme.sizing.baseUnit - 10,
}))(View);

const LoadingState = styled(({ theme }) => ({
  borderRadius: theme.sizing.baseBorderRadius,
  backgroundColor: theme.colors.background.inactive,
  height: theme.helpers.rem(0.5),
  width: '15%',
  marginHorizontal: 10,
}))(View);

const renderItem = ({ item }) => {
  const { title, active, onPress } = item;

  return (
    <Touchable onPress={() => onPress(item)}>
      <StyledH5 active={active}>{title}</StyledH5>
    </Touchable>
  );
};

const mapPropsToData = (data, { active, ...additionalProps }) =>
  data.map(({ id, ...item }) => ({
    ...item,
    ...additionalProps,
    id,
    active: id === active,
  }));

const Filters = ({ data, onPress, active, isLoading }) =>
  isLoading ? (
    <LoadingStateContainer>
      <LoadingState />
      <LoadingState />
      <LoadingState />
      <LoadingState />
    </LoadingStateContainer>
  ) : (
    <Container>
      <FlatList
        data={mapPropsToData(data, { onPress, active })}
        renderItem={renderItem}
        horizontal
        ListHeaderComponent={<EndCapSpacer />}
        ListFooterComponent={<EndCapSpacer />}
        showsHorizontalScrollIndicator={false}
      />
    </Container>
  );

Filters.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
      selected: PropTypes.bool,
    })
  ),
  onPress: PropTypes.func,
  active: PropTypes.string,
  isLoading: PropTypes.bool,
};

Filters.defaultProps = {
  data: [],
  onPress: () => null,
  active: '',
  isLoading: false,
};

export default Filters;
