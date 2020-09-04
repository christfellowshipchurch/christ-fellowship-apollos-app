import React from 'react';
import PropTypes from 'prop-types';
import { styled, Button } from '@apollosproject/ui-kit';
import { useMutation } from '@apollo/react-hooks';
import moment from 'moment';
import ATTEND_MEETING from './attendMeeting';

const StyledButton = styled(({ theme }) => ({
  marginBottom: theme.sizing.baseUnit,
}))(Button);

const CheckInConnected = ({ id, date, isLoading }) => {
  const [handleAttend, { loading: mutationLoading }] = useMutation(
    ATTEND_MEETING
  );
  return moment(date).format('MMDDYYYY') === moment().format('MMDDYYYY') ? (
    <StyledButton
      onPress={() => handleAttend({ variables: { id } })}
      loading={isLoading || mutationLoading}
      title={'Check-In'}
      type={'primary'}
      pill={false}
    />
  ) : null;
};

CheckInConnected.propTypes = {
  id: PropTypes.string,
  isLoading: PropTypes.bool,
  date: PropTypes.string,
};

export default CheckInConnected;
