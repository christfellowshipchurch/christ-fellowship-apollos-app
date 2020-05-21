import React from 'react';
import PropTypes from 'prop-types';

import { Button } from '@apollosproject/ui-kit';
import { useLinkRouter } from '../../hooks';

const ButtonWithLinkRouting = ({ url, disabled, ...props }) => {
  const { routeLink } = useLinkRouter();

  return <Button {...props} onPress={() => routeLink(url)} />;
};

ButtonWithLinkRouting.propTypes = {
  url: PropTypes.string,
  disabled: PropTypes.bool,
};

ButtonWithLinkRouting.defaultProps = {
  disabled: false,
};

export default ButtonWithLinkRouting;
