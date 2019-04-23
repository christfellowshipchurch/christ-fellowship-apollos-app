import React from 'react';
import {
  TableView,
  Cell,
  CellIcon,
  CellText,
  Touchable,
} from '@apollosproject/ui-kit';
import { withNavigation } from 'react-navigation';
import PropTypes from 'prop-types';

const Toolbar = ({ navigation }) => (
  <TableView>
    <Touchable
      onPress={() => {
        navigation.navigate('Passes');
      }}
    >
      <Cell>
        <CellIcon name="check" />
        <CellText>Check-in</CellText>
      </Cell>
    </Touchable>
  </TableView>
);

Toolbar.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

export default withNavigation(Toolbar);
