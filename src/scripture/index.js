import React from 'react';
import { Query } from 'react-apollo';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import ScriptureItem from 'ChristFellowship/src/ui/Scripture/ScriptureItem';
import getScripture from './getScripture';

/**
 * This is the data-bound "connected" scripture component.
 * Maps over the array of references, does a query to the API for each reference,
 * then passes that returned data to the ScriptureComponent for rendering.
 */
const ScriptureConnected = ({
  ScriptureComponent = ScriptureItem,
  references,
}) =>
  references.map((query) => (
    <Query query={getScripture} variables={{ query }} key={query}>
      {({ loading, data }) => (
        <ScriptureComponent
          reference={get(data, 'scripture.reference', '')}
          html={get(data, 'scripture.html', '')}
          copyright={get(data, 'scripture.copyright', '')}
          isLoading={loading}
        />
      )}
    </Query>
  ));

/**
 * Props passed to this connected component:
 * ScriptureComponent: An optional component that would allow you to display
 * scripture your way. Defaults to ScriptureItem.
 * references: An array of strings of Bible verses (i.e. ['Genesis 1:1'])
 */
ScriptureConnected.propTypes = {
  ScriptureComponent: PropTypes.element,
  references: PropTypes.arrayOf(PropTypes.string),
};

export default ScriptureConnected;
