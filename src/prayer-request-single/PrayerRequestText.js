import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { useQuery } from '@apollo/client';

import { H4 } from '@apollosproject/ui-kit';

import GET_PRAYER_REQUEST from './getPrayerRequest';
import Label from './styles';

const PrayerRequestText = ({ prayerRequestId, isLoading, title }) => {
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
      <H4 isLoading={loading || isLoading}>{get(data, 'node.text')}</H4>
    </View>
  );
};

PrayerRequestText.propTypes = {
  prayerRequestId: PropTypes.string,
  title: PropTypes.string,
  isLoading: PropTypes.bool,
};

PrayerRequestText.defaultProps = {
  title: 'Prayer Request',
};

export default PrayerRequestText;
