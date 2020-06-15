import React from 'react';
import { View, FlatList } from 'react-native';
import PropTypes from 'prop-types';

import { Touchable, H5, styled } from '@apollosproject/ui-kit';

const EndCapSpacer = styled(({ theme }) => ({
  width: theme.sizing.baseUnit * 0.5,
}))(View);

const StyledH5 = styled(({ theme, active }) => ({
  color: active ? theme.colors.text.primary : theme.colors.text.secondary,
  fontWeight: active ? 'bold' : 'normal',
}))(H5);

const FilterButton = styled(({ theme }) => ({
  justifyContent: 'center',
  alignItems: 'center',
  paddingHorizontal: theme.sizing.baseUnit * 0.5,
  paddingVertical: theme.sizing.baseUnit,
}))(View);

const LoadingStateContainer = styled(({ theme }) => ({
  flexDirection: 'row',
  paddingVertical: theme.sizing.baseUnit,
  paddingLeft: theme.sizing.baseUnit - 10,
}))(View);

const LoadingState = styled(({ theme }) => ({
  borderRadius: theme.sizing.baseBorderRadius,
  backgroundColor: theme.colors.background.inactive,
  height: theme.helpers.rem(0.5),
  width: '10%',
  marginHorizontal: 10,
}))(View);

const renderItem = ({ item }) => {
  const { title, active, onPress } = item;

  return (
    <Touchable onPress={() => onPress(item)}>
      <FilterButton>
        <StyledH5 active={active}>{title}</StyledH5>
      </FilterButton>
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
      <FlatList
        data={mapPropsToData(data, { onPress, active })}
        renderItem={renderItem}
        horizontal
        ListHeaderComponent={<EndCapSpacer />}
        ListFooterComponent={<EndCapSpacer />}
        showsHorizontalScrollIndicator={false}
      />
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
