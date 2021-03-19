import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import { get, isEmpty } from 'lodash';
import { TrackEventWhenLoaded } from '@apollosproject/ui-analytics';
import { InteractWhenLoadedConnected } from '@apollosproject/ui-connected';
import { SafeAreaView } from 'react-native-safe-area-context';

import { StatusBar } from 'react-native';
import { ErrorCard } from '@apollosproject/ui-kit';
import NavigationHeader from 'ui/NavigationHeader';
import ThemeMixin from '../ui/DynamicThemeMixin';

import ActionContainer from './ActionContainer';
import GET_CONTENT_ITEM from './getContentItem';

import PlayerContainerConnected from './PlayerContainerConnected';
import ContentBody from './ContentBody';

const renderContent = ({ content, loading, error }) => (
  <ContentBody
    loading={loading}
    error={error}
    content={content}
    id={content?.id}
  />
);

const ContentSingle = (props) => {
  const itemId = props.route?.params?.itemId;
  const { data, loading, error } = useQuery(GET_CONTENT_ITEM, {
    variables: { itemId },
    skip: isEmpty(itemId),
    fetchPolicy: 'cache-and-network',
  });

  if (error && !data && !loading)
    return (
      <SafeAreaView>
        <NavigationHeader />
        <ErrorCard error={error} />
      </SafeAreaView>
    );

  const content = get(data, 'node', {});
  const { theme = {}, id } = content;

  return (
    <ThemeMixin theme={theme}>
      <NavigationHeader />
      <StatusBar hidden />
      <InteractWhenLoadedConnected
        isLoading={loading}
        nodeId={itemId}
        action={'COMPLETE'}
      />
      <TrackEventWhenLoaded
        loaded={!!(!loading && content.title)}
        eventName={'View Content'}
        properties={{
          title: content.title,
          itemId,
        }}
      />
      <PlayerContainerConnected nodeId={itemId}>
        {renderContent({ content, loading, error })}
      </PlayerContainerConnected>
      <ActionContainer itemId={id} />
    </ThemeMixin>
  );
};

ContentSingle.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      itemId: PropTypes.string,
    }),
  }),
};

export default ContentSingle;
