/**
 * Filters.js
 *
 * Author: Caleb Panza
 * Created: Mar 05, 2021
 *
 * Displays a row of buttons for selecting the Filter by which to render Content Categories.
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { get, first, capitalize, find } from 'lodash';

import { FlatList } from 'react-native';
import {
  LoadingState,
  LoadingStateContainer,
  Container,
  EndCapSpacer,
  StyledTouchable,
  RoundedBorder,
  StyledH5,
} from './components';

const GET_FILTERS = gql`
  query getBrowseFilters {
    browseFilters {
      id
      title
    }
  }
`;

const renderItem = ({ item }) => {
  const { title, active, onPress } = item;

  return (
    <StyledTouchable onPress={() => onPress(item)}>
      <RoundedBorder active={active}>
        <StyledH5 active={active}>{title}</StyledH5>
      </RoundedBorder>
    </StyledTouchable>
  );
};

const mapPropsToData = (data, { active, ...additionalProps }) =>
  data.map(({ id, ...item }) => ({
    ...item,
    ...additionalProps,
    id,
    active: id === active,
  }));

const Filters = ({ selected, onChange }) => {
  const [active, setActive] = useState(selected);
  const { loading, error, data } = useQuery(GET_FILTERS, {
    fetchPolicy: 'cache-and-network',
    onCompleted: (completedData) => {
      if (!active) {
        const firstId = completedData?.browseFilters[0]?.id;
        setActive(firstId);
        onChange(firstId);
      }
    },
  });

  const onPress = ({ id }) => {
    setActive(id);
    onChange(id);
  };

  if (loading)
    return (
      <LoadingStateContainer>
        <LoadingState />
        <LoadingState />
        <LoadingState />
        <LoadingState />
      </LoadingStateContainer>
    );

  return (
    <Container>
      <FlatList
        data={mapPropsToData(data?.browseFilters, { onPress, active })}
        renderItem={renderItem}
        horizontal
        ListHeaderComponent={<EndCapSpacer />}
        ListFooterComponent={<EndCapSpacer />}
        showsHorizontalScrollIndicator={false}
      />
    </Container>
  );
};

Filters.propTypes = {
  selected: PropTypes.string,
  onChange: PropTypes.func,
};

Filters.defaultProps = {
  selected: null,
  onChange: () => null,
};

export default Filters;
