import React from 'react';
import { useQuery } from '@apollo/client';
import PropTypes from 'prop-types';
import { isEmpty, get } from 'lodash';
import { useNavigation } from '@react-navigation/native';

import { View } from 'react-native';
import {
  Touchable,
  UIText,
  Icon,
  withTheme,
  styled,
} from '@apollosproject/ui-kit';
import { HorizontalDivider } from 'ui/Dividers';

import GET_SCRIPTURE from './getScripture';

/** Horizontal Divider */
const Container = styled(({ theme }) => ({
  alignItems: 'center',
  justifyContent: 'center',
}))(View);

const HorizontalDividerStyled = styled(({ theme, useMargin }) => ({
  marginHorizontal: theme.sizing.baseUnit,
  ...(useMargin === 'top' ? { marginTop: theme.sizing.baseUnit } : {}),
  ...(useMargin === 'bottom' ? { marginBottom: theme.sizing.baseUnit } : {}),
  width: '90%',
}))(HorizontalDivider);

/** Button */
const ButtonRow = styled(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: theme.sizing.baseUnit * 0.5,
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
      <HorizontalDividerStyled useMargin="top" />
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
      <HorizontalDividerStyled useMargin="bottom" />
    </Container>
  );
};

ScriptureButton.propTypes = {
  /** The id of the node */
  nodeId: PropTypes.string,
};

export default ScriptureButton;
