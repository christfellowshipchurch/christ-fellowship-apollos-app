import React from 'react';
import PropTypes from 'prop-types';
import { H4, styled, ButtonLink } from '@apollosproject/ui-kit';

const StyledH4 = styled(({ theme }) => ({
  color: theme.colors.primary,
  textAlign: 'center',
  textDecorationLine: 'underline',
  paddingBottom: theme.sizing.baseUnit * 1.5,
}))(H4);

const ScriptureList = ({
  references,
  onPress,
  tabDestination,
  commas = true,
}) => {
  if (!references && commas) return '';
  if (!references) return [];

  let combo = references.map((reference) => `${reference}`);

  if (commas) {
    combo = combo.join(', ');
  }

  const handleOnPress = () => onPress(tabDestination);

  return (
    <StyledH4>
      <ButtonLink padded onPress={handleOnPress}>
        {combo}
      </ButtonLink>
    </StyledH4>
  );
};

ScriptureList.propTypes = {
  /** Toggles comma formating */
  commas: PropTypes.bool,
  /** The ButtonLink handler */
  onPress: PropTypes.func,
  /** An array of human readable references (i.e. '1 Corinthians 15:57') */
  references: PropTypes.arrayOf(PropTypes.string),
  /** The tab to go to onPress */
  tabDestination: PropTypes.string,
};

export default ScriptureList;
