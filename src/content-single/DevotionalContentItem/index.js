import React, { PureComponent } from 'react';
import { Animated, View } from 'react-native';
import PropTypes from 'prop-types';
import { Query } from '@apollo/client/react/components';
import { get } from 'lodash';

import { MediaControlsConnected } from '@apollosproject/ui-connected';
import {
  ErrorCard,
  TabView,
  TabSceneMap as SceneMap,
  BackgroundView,
  styled,
  StretchyView,
  GradientOverlayImage,
} from '@apollosproject/ui-kit';
import ContentTab from './ContentTab';
import ScriptureTab from './ScriptureTab';

import GET_SCRIPTURE from './getScripture';

const FlexedScrollView = styled({ flex: 1 })(Animated.ScrollView);

const StyledMediaControlsConnected = styled(({ theme }) => ({
  position: 'absolute',
  bottom: theme.sizing.baseUnit,
}))(MediaControlsConnected);
/**
 * The devotional component.
 * Displays a TabView with two tabs: ContentTab and ScriptureTab.
 */
class DevotionalContentItem extends PureComponent {
  static propTypes = {
    /** The id of the devotional item */
    id: PropTypes.string.isRequired,
    content: PropTypes.shape({
      /** The devotional title */
      title: PropTypes.string,
      id: PropTypes.string,
    }),
    /** Toggles placeholders */
    loading: PropTypes.bool,
    navigation: PropTypes.shape({}),
  };

  /**
   * Function to get the scripture references from the larger scripture object.
   * Props: full scripture array of objects
   * Returns: an array of scripture references.
   */
  getScriptureReferences = (scripture) => {
    let arrayOfRefrences = null;

    if (scripture) {
      arrayOfRefrences = scripture.map(
        (ref) =>
          // only add refs to the array if they exist
          ref.reference || ''
      );
    }

    return arrayOfRefrences;
  };

  /**
   * The route that TabView uses to render the ContentTab.
   * Note: navigationState gets passed down automatically from the TabView.
   */
  contentRoute = ({ scriptures, loading }) => (navigationState) => (
    <ContentTab
      id={this.props.id}
      references={this.getScriptureReferences(scriptures)}
      title={this.props.content.title}
      navigationState={navigationState}
      navigation={this.props.navigation}
      isLoading={this.props.loading || loading}
    />
  );

  /**
   * The route that TabView uses to render the ScriptureTab
   */
  scriptureRoute = ({ scriptures, loading }) => () => (
    <ScriptureTab
      id={this.props.id}
      scripture={scriptures}
      navigation={this.props.navigation}
      isLoading={this.props.loading || loading}
    />
  );

  renderLoading = () => (
    <ContentTab title={''} isLoading navigation={this.props.navigation} />
  );

  renderTabs = ({ data, error, loading }) => {
    if (error) return <ErrorCard error={error} />;

    const scriptures = get(data, 'node.scriptures', []);

    // only include scriptures where the references are not null
    const validScriptures = scriptures
      ? scriptures.filter((scripture) => scripture.reference != null)
      : [];

    const hasScripture = loading || validScriptures.length;
    const tabRoutes = [{ title: 'Content', key: 'content' }];
    const map = {
      content: this.contentRoute({ scriptures, loading }),
    };
    if (hasScripture) {
      tabRoutes.push({ title: 'Scripture', key: 'scripture' });
      map.scripture = this.scriptureRoute({ scriptures, loading });
    }
    return tabRoutes.length < 2 ? (
      map[tabRoutes[0].key]()
    ) : (
      <TabView routes={tabRoutes} renderScene={SceneMap(map)} />
    );
  };

  render() {
    const { content, loading: parentLoading } = this.props;
    const coverImageSources = get(content, 'coverImage.sources', []);

    return (
      <BackgroundView>
        <StretchyView>
          {({ Stretchy, ...scrollViewProps }) => (
            <FlexedScrollView {...scrollViewProps}>
              <View>
                {coverImageSources.length || parentLoading ? (
                  <Stretchy>
                    <GradientOverlayImage
                      isLoading={!coverImageSources.length && parentLoading}
                      source={coverImageSources}
                      // Sets the ratio of the image
                      minAspectRatio={1}
                      maxAspectRatio={1}
                      // Sets the ratio of the placeholder
                      forceRatio={1}
                      // No ratios are respected without this
                      maintainAspectRatio
                    />
                  </Stretchy>
                ) : null}
                {coverImageSources.length > 0 && (
                  <StyledMediaControlsConnected contentId={content.id} />
                )}
              </View>

              <Query
                query={GET_SCRIPTURE}
                variables={{ itemId: this.props.id }}
                fetchPolicy="cache-and-network"
              >
                {({ data, loading, error }) =>
                  loading
                    ? this.renderLoading()
                    : this.renderTabs({ data, loading, error })
                }
              </Query>
            </FlexedScrollView>
          )}
        </StretchyView>
      </BackgroundView>
    );
  }
}

export default DevotionalContentItem;
