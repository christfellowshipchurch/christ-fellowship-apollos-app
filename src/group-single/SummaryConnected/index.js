import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import { get } from 'lodash';

import { View } from 'react-native';
import ExpandableText from 'react-native-expandable-text';
import {
  PaddedView,
  BodyText,
  withTheme,
  styled,
  UIText,
  Touchable,
} from '@apollosproject/ui-kit';

import GET_SUMMARY from './getSummary';

const ToggleText = withTheme(({ theme }) => ({
  bold: true,
  style: {
    color: theme.colors.primary,
    fontSize: 12,
  },
}))(UIText);

const ToggleSpacing = styled(({ theme }) => ({
  paddingTop: theme.sizing.baseUnit * 0.5,
}))(View);

const SummaryConnected = ({ id, isCollapsed }) => {
  const [collapsed, setCollapsed] = useState(isCollapsed);
  const [expandable, setExpandable] = useState(false);
  const { data, loading } = useQuery(GET_SUMMARY, {
    variables: { groupId: id },
    skip: !id,
    fetchPolicy: 'cache-and-network',
  });

  const summary = get(data, 'node.summary');

  if (!summary && !loading) return null;

  return (
    <PaddedView horizontal={false}>
      <ExpandableText
        collapseNumberOfLines={5}
        collapsed={collapsed}
        onExpandableChange={(isExpandable) => setExpandable(isExpandable)}
      >
        <BodyText isLoading={!summary && loading}>{summary}</BodyText>
      </ExpandableText>
      {expandable && (
        <ToggleSpacing>
          <Touchable onPress={() => setCollapsed(!collapsed)}>
            <ToggleText>{`See ${collapsed ? 'More' : 'Less'}`}</ToggleText>
          </Touchable>
        </ToggleSpacing>
      )}
    </PaddedView>
  );
};

SummaryConnected.propTypes = {
  id: PropTypes.string,
  isCollapsed: PropTypes.bool,
};

SummaryConnected.defaultProps = {
  isCollapsed: true,
};

export default SummaryConnected;
