import React from 'react';
import { useQuery } from '@apollo/client';
import PropTypes from 'prop-types';
import { isEmpty, get } from 'lodash';

import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TrackEventWhenLoaded } from '@apollosproject/ui-analytics';
import { BackgroundView, PaddedView, ErrorCard } from '@apollosproject/ui-kit';
import ScriptureItem from '@apollosproject/ui-scripture';

import GET_SCRIPTURE from './getScripture';

const ScriptureSingle = (props) => {
  const nodeId = props.route?.params?.nodeId;
  const { data, loading, error } = useQuery(GET_SCRIPTURE, {
    fetchPolicy: 'cache-and-network',
    variables: {
      nodeId,
    },
    skip: !nodeId || isEmpty(nodeId),
  });

  const scriptures = get(data, 'node.scriptures', []) || [];

  // Only display an error if we don't have any data. Not all errors thrown are worth taking over the entire UI for, so we only want to show the error card if we're certain that no data is able to be shown to the user.
  if (error && !scriptures)
    return (
      <BackgroundView>
        <SafeAreaView>
          <ErrorCard />
        </SafeAreaView>
      </BackgroundView>
    );

  return (
    <BackgroundView>
      <ScrollView>
        <SafeAreaView>
          <PaddedView>
            {scriptures.map(({ id, reference, version }, i) => (
              <TrackEventWhenLoaded
                key={`${id}_track_event`}
                loaded={!!(!loading && id)}
                eventName={'View Scripture'}
                properties={{
                  id,
                  reference,
                  version,
                  nodeId,
                }}
              />
            ))}

            {scriptures.map((ref, i) => (
              <ScriptureItem
                key={ref.id}
                reference={ref.reference}
                html={ref.html}
                isLoading={loading}
                copyright={
                  // only show last copyright
                  scriptures.length - 1 === i ? ref.copyright : null
                }
                version={ref.version}
              />
            ))}
          </PaddedView>
        </SafeAreaView>
      </ScrollView>
    </BackgroundView>
  );
};

ScriptureSingle.propTypes = {};

export default ScriptureSingle;
