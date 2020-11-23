import PropTypes from 'prop-types';

// eslint-disable-next-line import/prefer-default-export
export const ResourceShape = PropTypes.shape({
  id: PropTypes.string,
  title: PropTypes.string,
  action: PropTypes.string,
  relatedNode: PropTypes.shape({
    __typename: PropTypes.string,
    id: PropTypes.string,
    title: PropTypes.string,
    url: PropTypes.string,
  }),
});
