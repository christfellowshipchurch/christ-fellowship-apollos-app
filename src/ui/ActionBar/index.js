import React from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import Color from 'color';
import { uniqueId } from 'lodash';

import { Card, styled } from '@apollosproject/ui-kit';

export ActionBarItem from './ActionBarItem';

const Row = styled({
  flexDirection: 'row',
  justifyContent: 'space-around',
  alignItems: 'center',
})(View);

const Divider = styled(({ theme }) => ({
  opacity: 0.5,
  height: '70%',
  width: StyleSheet.hairlineWidth,
  backgroundColor: Color(
    Color(theme.colors.screen).isLight()
      ? theme.colors.black
      : theme.colors.white
  ),
}))(View);

const ActionBar = ({ children, ...props }) => (
  <Card {...props}>
    <Row>
      {React.Children.map(children, (child, i) => (
        <React.Fragment key={uniqueId(`ActionBar:${i}`)}>
          {child}
          {i < children.length - 1 && <Divider />}
        </React.Fragment>
      ))}
    </Row>
  </Card>
);

ActionBar.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.element, PropTypes.func, PropTypes.object])
    ),
    PropTypes.object,
  ]),
};

export default ActionBar;
