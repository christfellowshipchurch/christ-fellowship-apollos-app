import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { get } from 'lodash';
import getLiveContent from './getLiveContent';

const { Provider, Consumer } = React.createContext([]);

const LiveProvider = (props) => (
  <Query query={getLiveContent} pollInterval={30000}>
    {({ data: { liveStreams = [] } = {} }) => (
      <Provider value={liveStreams}>{props.children}</Provider>
    )}
  </Query>
);

const LiveConsumer = ({ contentId, children }) => (
  <Consumer>
    {(liveStreams) => {
      const stream = liveStreams.find(
        (s) => get(s, 'contentItem.id') === contentId
      );
      return children(stream);
    }}
  </Consumer>
);

LiveConsumer.propTypes = {
  children: PropTypes.node,
  contentId: PropTypes.string,
};

LiveProvider.propTypes = { children: PropTypes.node };

export { LiveProvider, LiveConsumer };
