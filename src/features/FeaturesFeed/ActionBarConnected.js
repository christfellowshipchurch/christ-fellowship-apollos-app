import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { chunk } from 'lodash';

import {
  styled,
  ActivityIndicator,
  ThemeMixin,
  H6,
} from '@apollosproject/ui-kit';
import { AnalyticsConsumer } from '@apollosproject/ui-analytics';
import ActionBar, { ActionBarItem } from 'ui/ActionBar';

const ActionBarFeatureConnected = ({
  featureId,
  isLoading,
  listKey,
  actions,
  onPressItem,
}) => {
  if (isLoading && !actions.length)
    return (
      <ActionBar listKey={listKey}>
        <ActivityIndicator />
      </ActionBar>
    );

  /** This action bar looks really good with 3 items in it,
   *  but it starts to get pretty wonky after that. For right now,
   *  we're gonna put in a safety net so that if anyone puts in more
   *  than 3 items, we just create multiple bars
   */
  const chunkedActions = chunk(actions, 3);

  return (
    <View listKey={`${listKey}`}>
      {chunkedActions.map((actionChunk, i) => (
        <ActionBar key={`${listKey}:${i}`}>
          {actionChunk.map(
            ({ action, icon, title, theme, relatedNode, ...actionProps }) => (
              <AnalyticsConsumer
                key={`ActionBarFeature:${featureId}:${action}:${title}`}
              >
                {({ track }) => (
                  <ThemeMixin mixin={theme}>
                    <ActionBarItem
                      onPress={() => {
                        track({
                          eventName: 'Pressed Action Bar Feature Item',
                          properties: {
                            featureId,
                            title,
                            relatedNode: relatedNode.id,
                          },
                        });
                        onPressItem({
                          action,
                          icon,
                          title,
                          relatedNode,
                          ...actionProps,
                        });
                      }}
                      {...(!icon ? {} : { icon })}
                      label={title}
                    />
                  </ThemeMixin>
                )}
              </AnalyticsConsumer>
            )
          )}
        </ActionBar>
      ))}
    </View>
  );
};

ActionBarFeatureConnected.propTypes = {
  featureId: PropTypes.string,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      action: PropTypes.string,
      relatedNode: PropTypes.shape({
        id: PropTypes.string,
      }),
      theme: PropTypes.shape({
        colors: PropTypes.shape({
          primary: PropTypes.string,
        }),
      }),
    })
  ),
  isLoading: PropTypes.bool,
  listKey: PropTypes.string,
  onPressItem: PropTypes.func,
};

ActionBarFeatureConnected.defaultProps = {
  actions: [],
  onPressItem: () => null,
};

export default ActionBarFeatureConnected;