import React, { PureComponent, useState } from 'react';
import { Query } from 'react-apollo';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import ScreenOrientation, {
  PORTRAIT,
  UNLOCK,
} from 'react-native-orientation-locker/ScreenOrientation';

import { ErrorCard } from '@apollosproject/ui-kit';
import { TrackEventWhenLoaded } from '@apollosproject/ui-analytics';
import { InteractWhenLoadedConnected } from '@apollosproject/ui-connected';
import NavigationHeader from 'ui/NavigationHeader';
import ThemeMixin from '../ui/DynamicThemeMixin';

import ActionContainer from './ActionContainer';
import GET_CONTENT_ITEM from './getContentItem';

import DevotionalContentItem from './DevotionalContentItem';
import UniversalContentItem from './UniversalContentItem';
import WeekendContentItem from './WeekendContentItem';
import EventContentItem from './EventContentItem';
import InformationalContentItem from './InformationalContentItem';

const OrientationHandler = () => {
  const [orientation, setOrientation] = useState(PORTRAIT);

  return (
    <ScreenOrientation
      orientation={orientation}
      onChange={(newOrientation) => {
        /**
         * There's a weird UI bug that's happening when following these steps
         * if the Orientation is perminantly set to `PORTRAIT` on Content Single:
         *
         * 1. Open Content Single
         * 2. Play a video
         * 3. Rotate to Landscape
         * 4. Minimize and close the video
         * 5. Content Single auto rotates back to Portrait, but sometimes the
         *    content gets distorted and messed up
         *
         * The solution:
         * An orientation change is only triggered by the Media Player, so if the
         * orientation changes, that means the Media Player is open and we want to
         * unlock the orientation of the Content Single until the user manually resets
         * the orientation to PORTAIT, in which case we will then lock it back to PORTRAIT
         * mode without any risk of strange resizing as mentioned above.
         */

        if (newOrientation !== PORTRAIT && orientation === PORTRAIT) {
          setOrientation(UNLOCK);
        } else if (orientation !== PORTRAIT) {
          setOrientation(PORTRAIT);
        }
      }}
    />
  );
};

class ContentSingle extends PureComponent {
  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
      push: PropTypes.func,
    }),
  };

  static navigationOptions = {
    header: NavigationHeader,
    headerTransparent: true,
    headerMode: 'float',
  };

  get itemId() {
    return this.props.navigation.getParam('itemId', []);
  }

  get queryVariables() {
    return { itemId: this.itemId };
  }

  renderContent = ({ content, loading, error }) => {
    let { __typename } = content;
    if (!__typename && this.itemId) {
      [__typename] = this.itemId.split(':');
    }

    switch (__typename) {
      case 'DevotionalContentItem':
        return (
          <DevotionalContentItem
            id={this.itemId}
            content={content}
            loading={loading}
            error={error}
          />
        );
      case 'EventContentItem':
        return (
          <EventContentItem
            id={this.itemId}
            content={content}
            loading={loading}
            error={error}
          />
        );
      case 'WeekendContentItem':
        return (
          <WeekendContentItem
            id={this.itemId}
            content={content}
            loading={loading}
            error={error}
          />
        );
      case 'InformationalContentItem':
        return (
          <InformationalContentItem
            id={this.itemId}
            content={content}
            loading={loading}
            error={error}
          />
        );
      case 'UniversalContentItem':
      default:
        return (
          <UniversalContentItem
            id={this.itemId}
            content={content}
            loading={loading}
            error={error}
          />
        );
    }
  };

  renderWithData = ({ loading, error, data }) => {
    if (error) return <ErrorCard error={error} />;

    const content = get(data, 'node', {});
    const { theme = {}, id } = content;

    return (
      <ThemeMixin theme={theme}>
        <InteractWhenLoadedConnected
          isLoading={loading}
          nodeId={this.itemId}
          action={'COMPLETE'}
        />
        <TrackEventWhenLoaded
          loaded={!!(!loading && content.title)}
          eventName={'View Content'}
          properties={{
            title: content.title,
            itemId: this.itemId,
          }}
        />
        <OrientationHandler />
        {this.renderContent({ content, loading, error })}
        <ActionContainer itemId={id} />
      </ThemeMixin>
    );
  };

  render() {
    return (
      <Query
        query={GET_CONTENT_ITEM}
        variables={this.queryVariables}
        fetchPolicy="cache-and-network"
      >
        {this.renderWithData}
      </Query>
    );
  }
}

export default ContentSingle;
