/**
 * EditAddress.js
 *
 * Author: Caleb Panza
 * Created: Apr 09, 2021
 *
 * Edit the user's address
 */

import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { useNavigation } from '@react-navigation/native';
import { useCurrentUser, useForm } from 'hooks';

import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Button,
  TextInput,
  Picker,
  PickerItem,
  styled,
  withTheme,
  H3,
} from '@apollosproject/ui-kit';

// :: Constants
// :: ============================
const STATE_OPTIONS = gql`
  query getStateOptions {
    stateOptions
  }
`;

// :: Components
// :: ============================
const BackgroundView = styled(({ theme }) => ({
  padding: theme.sizing.baseUnit,
  justifyContent: 'space-between',
  flexDirection: 'column',
  flex: 1,
}))(SafeAreaView);

// :: Styles
// :: ============================
const StyledH3 = styled(({ theme }) => ({
  paddingVertical: theme.sizing.baseUnit,
}))(H3);

const StyledPicker = withTheme(({ theme }) => ({
  itemStyle: {
    color: theme.colors.text.primary,
  },
}))(Picker);

const EditAddress = () => {
  const navigation = useNavigation();
  const { data, loading: statesLoading } = useQuery(STATE_OPTIONS, {
    fetchPolicy: 'cache-first',
  });
  const { address, updateAddress, loading: userLoading } = useCurrentUser({
    onUpdate: () => navigation.goBack(null),
  });

  const { values, setValues, setValue } = useForm({
    street1: '',
    street2: '',
    city: '',
    state: '',
    postalCode: '',
  });

  const loading = statesLoading || userLoading;
  const states = data?.stateOptions || [];
  const { street1, city, state, postalCode } = values;
  const onPress = () => {
    if (!loading) {
      updateAddress({ variables: { address: values } });
    }
  };

  useEffect(
    () => {
      setValues({
        street1: address?.street1,
        street2: address?.street2,
        city: address?.city,
        state: address?.state,
        postalCode: address?.postalCode,
      });
    },
    [address]
  );

  return (
    <BackgroundView edges={['bottom']}>
      <View>
        <StyledH3>Update Address</StyledH3>
        <TextInput
          label="Street"
          value={street1}
          onChangeText={(text) => setValue('street1', text)}
          disabled={loading}
        />
        <TextInput label="City" value={city} disabled={loading} />

        <StyledPicker
          label="State"
          displayValue={state}
          value={state}
          disabled={loading}
          onValueChange={(value) => setValue('state', value)}
          itemStyle={{
            color: 'red',
          }}
        >
          {Array.isArray(states) &&
            states.map((s) => <PickerItem label={s} value={s} key={s} />)}
        </StyledPicker>
        <TextInput label="Postal Code" value={postalCode} disabled={loading} />
      </View>

      <View>
        <Button
          title="Done"
          onPress={onPress}
          disabled={loading}
          loading={loading}
        />
      </View>
    </BackgroundView>
  );
};

EditAddress.propTypes = {};
EditAddress.defaultProps = {};

export default EditAddress;
