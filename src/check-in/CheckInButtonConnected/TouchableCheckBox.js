import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { Touchable } from '@apollosproject/ui-kit';

import {
  CheckBoxDisabled,
  CheckBox,
  CheckBoxTitle,
  CheckIcon,
  Row,
} from './Components';

const TouchableCheckBox = ({
  onChange,
  title,
  disabled,
  selected: defaultSelected,
  id,
}) => {
  const [selected, setSelected] = useState(defaultSelected);

  useEffect(
    () => {
      onChange({ selected, id });
    },
    [selected]
  );

  return disabled ? (
    <CheckBoxDisabled>
      <Row>
        <CheckBox checked={selected}>{selected && <CheckIcon />}</CheckBox>

        <CheckBoxTitle>{title}</CheckBoxTitle>
      </Row>
    </CheckBoxDisabled>
  ) : (
    <Touchable onPress={() => setSelected(!selected)}>
      <Row>
        <CheckBox checked={selected}>{selected && <CheckIcon />}</CheckBox>

        <CheckBoxTitle>{title}</CheckBoxTitle>
      </Row>
    </Touchable>
  );
};

export default TouchableCheckBox;
