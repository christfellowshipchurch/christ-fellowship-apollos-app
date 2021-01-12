import React from 'react';
import { StatusBar } from 'react-native';
import { useQuery } from '@apollo/client';
import { get, isEmpty } from 'lodash';

import { ErrorCard } from '@apollosproject/ui-kit';
import { TrackEventWhenLoaded } from '@apollosproject/ui-analytics';
import { InteractWhenLoadedConnected } from '@apollosproject/ui-connected';
import ThemeMixin from '../ui/DynamicThemeMixin';

import ActionContainer from './ActionContainer';
import GET_CONTENT_ITEM from './getContentItem';

import PlayerContainerConnected from './PlayerContainerConnected';
import UniversalContentItem from './UniversalContentItem';
import EventContentItem from './EventContentItem';
import InformationalContentItem from './InformationalContentItem';

const ContentSingle = (props) => {
  const itemId = props.route?.params?.itemId;
  const { data, loading, error } = useQuery(GET_CONTENT_ITEM, {
    variables: { itemId },
    skip: isEmpty(itemId),
    fetchPolicy: 'cache-and-network',
  });

  if (error) return <ErrorCard error={error} />;

  const content = get(data, 'node', {});
  const { theme = {}, id } = content;
  const renderContent = () => {
    let { __typename } = content;
    if (!__typename && itemId) {
      [__typename] = itemId.split(':');
    }
    const screenProps = {
      id: itemId,
      content,
      loading,
      error,
    };

    switch (__typename) {
      // case 'DevotionalContentItem':
      //   return <DevotionalContentItem {...screenProps} />;
      case 'EventContentItem':
        return <EventContentItem {...screenProps} />;
      case 'InformationalContentItem':
        return <InformationalContentItem {...screenProps} />;
      case 'UniversalContentItem':
      default:
        return <UniversalContentItem {...screenProps} />;
    }
  };

  return (
    <ThemeMixin theme={theme}>
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

export default ContentSingle;
