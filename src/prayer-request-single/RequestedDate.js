import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { useQuery } from '@apollo/client';

import { H4 } from '@apollosproject/ui-kit';

import DateLabel from 'ui/DateLabel';
import GET_PRAYER_REQUEST from './getPrayerRequest';
import Label from './styles';

const RequestedDate = ({ prayerRequestId, isLoading, title }) => {
  const { loading, error, data } = useQuery(GET_PRAYER_REQUEST, {
    fetchPolicy: 'cache-first',
    skip: !prayerRequestId,
    variables: {
      prayerRequestId,
    },
  });

  return (
    <View>
      <Label isLoading={loading || isLoading}>{title}</Label>
      <DateLabel
        isLoading={loading || isLoading}
        date={get(data, 'node.requestedDate')}
        Component={H4}
      />
    </View>
  );
};

RequestedDate.propTypes = {
  prayerRequestId: PropTypes.string,
  title: PropTypes.string,
  isLoading: PropTypes.bool,
};

RequestedDate.defaultProps = {
  title: 'Prayer Requested On',
};

export default RequestedDate;
