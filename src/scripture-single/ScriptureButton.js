import React from 'react';
import { useQuery } from '@apollo/client';
import PropTypes from 'prop-types';
import { isEmpty, get } from 'lodash';
import { useNavigation } from '@react-navigation/native';

import { View, StyleSheet } from 'react-native';
import {
  Touchable,
  UIText,
  Icon,
  withTheme,
  styled,
} from '@apollosproject/ui-kit';

import GET_SCRIPTURE from './getScripture';

/** Horizontal Divider */
const Container = styled(({ theme }) => {
  const borderColor = theme.colors.text.tertiary;

  return {
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderTopColor: borderColor,
    borderBottomColor: borderColor,
    paddingVertical: theme.sizing.baseUnit * 2.5,
    marginHorizontal: theme.sizing.baseUnit,
  };
})(View);

/** Button */
const ButtonRow = styled(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  paddingBottom: theme.sizing.baseUnit * 0.25,
}))(View);

const ButtonIcon = withTheme(({ theme }) => ({
  name: 'book-closed',
  fill: theme.colors.primary,
  size: 16,
}))(Icon);

const ButtonText = styled(({ theme }) => ({
  color: theme.colors.primary,
  paddingLeft: theme.sizing.baseUnit * 0.25,
}))(UIText);

/** References */
const References = withTheme(({ theme }) => ({
  style: { color: theme.colors.text.secondary },
  italic: true,
}))(UIText);

const ScriptureButton = ({ nodeId }) => {
  const skip = !nodeId || isEmpty(nodeId);
  const navigation = useNavigation();
  const { data, loading, error } = useQuery(GET_SCRIPTURE, {
    fetchPolicy: 'cache-and-network',
    variables: {
      nodeId,
    },
    skip,
  });

  const scriptures = get(data, 'node.scriptures', []) || [];

  /**
   * Only display an error if we don't have any data. Not all errors thrown are worth taking over the entire UI for, so we only want to show the error card if we're certain that no data is able to be shown to the user.
   *
   * We can also hide the component if we're loading data, still as the default state of this component is to not show
   *
   * If there are no scripture verses returned, there is no need to navigate to an empty screen and we can just go ahead and hide the button
   */
  if (
    skip ||
    (error && !scriptures.length > 0) ||
    loading ||
    scriptures.length === 0
  )
    return null;

  return (
    <Container>
      <Touchable
        onPress={() => navigation.navigate('ScriptureSingle', { nodeId })}
      >
        <ButtonRow>
          <ButtonIcon />
          <ButtonText bold>Read Scripture</ButtonText>
        </ButtonRow>
      </Touchable>
      <References>
        {scriptures.map(({ reference }) => reference).join(', ')}
      </References>
    </Container>
  );
};

ScriptureButton.propTypes = {
  /** The id of the node */
  nodeId: PropTypes.string,
};

export default ScriptureButton;
