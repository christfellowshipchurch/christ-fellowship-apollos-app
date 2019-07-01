import React from 'react';
import PropTypes from 'prop-types';
import { ModalViewHeader } from '@apollosproject/ui-kit';

const NavigationHeader = ({ scene, navigation }) => {
  let onBack = null;
  if (scene.index > 0) onBack = () => navigation.goBack();
  const onClose = () => {
    // Since we're dealing with nested navigators, we have to trigger two actions:
    // One action that pops us to the top of the modal's navigation history
    // Another action that pops us one more level, which triggers the modal to close.
    //
    // FWIW, calling something like `.pop(scenes.length + 1)` or something does not work,
    // as that results in the same thing as `.popToTop()`. React-Navigation must have some special-case
    // handling for calling `.pop()` at the top of a nested navigators stack.
    //
    // Because react (or redux?) chains renders, this still results in only one clean animation!
    //
    // This "double pop" is only needed when we are already deep in a navigation stack.
    // In ReactNavigation, we could look at using "goBack('ContentSingle')"
    if (scene.index > 0) {
      navigation.popToTop();
    }
    navigation.pop();
  };

  return <ModalViewHeader onClose={onClose} onBack={onBack} navigationHeader />;
};

NavigationHeader.propTypes = {
  scene: PropTypes.shape({
    index: PropTypes.number,
  }),
  navigation: PropTypes.shape({
    pop: PropTypes.func,
    popToTop: PropTypes.func,
  }),
};

export default NavigationHeader;
