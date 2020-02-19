import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { withNavigation } from 'react-navigation';
import PropTypes from 'prop-types';
import moment from 'moment';

import {
    styled,
    ActivityIndicator,
    FlexedView,
    H4,
} from '@apollosproject/ui-kit';

import {
    TextInput,
    DateInput,
    Picker,
    PickerItem,
    Radio,
    RadioButton,
    InputWrapper,
} from '../../ui/inputs';
import { FieldContainer, ContentContainer } from '../components';

import { GET_STATES } from '../queries';

const Overlay = styled(() => ({
    alignContent: 'center',
    justifyContent: 'center',
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, .75)',
    top: 0,
    left: 0,
    zIndex: 1,
}))(FlexedView);

const EditUserProfile = ({
    genderList,
    navigation,
    onChange,
    street1,
    city,
    state,
    postalCode,
    birthDate,
    gender,
    campus,
    isLoading,
}) => {
    const {
        loading: loadingStates,
        data: { getStatesList: { values: states = [] } = {} } = {},
    } = useQuery(GET_STATES);
    const disabled = isLoading || loadingStates;

    return (
        <ContentContainer>
            {disabled && (
                <Overlay>
                    <ActivityIndicator />
                </Overlay>
            )}

            <FieldContainer key={`ProfileForm:Campus`}>
                <H4>Campus</H4>
                <InputWrapper
                    displayValue={campus}
                    icon="church"
                    actionIcon="angle-right"
                    handleOnPress={() => navigation.navigate('Location')}
                    disabled={disabled}
                />
            </FieldContainer>

            <FieldContainer key={`ProfileForm:HomeAddress`}>
                <H4>Home Address</H4>
                <TextInput
                    label="Street Address"
                    value={street1}
                    onChangeText={(text) => onChange('street1', text)}
                    icon="home"
                    disabled={disabled}
                />
                <TextInput
                    label="City"
                    value={city}
                    onChangeText={(text) => onChange('city', text)}
                    hideIcon
                    disabled={disabled}
                />
                <Picker
                    label="State"
                    value={state}
                    displayValue={state}
                    onValueChange={(newState) => onChange('state', newState)}
                    hideIcon
                    disabled={disabled}
                >
                    {states.map((n, i) => (
                        <PickerItem label={n.value} value={n.value} key={i} />
                    ))}
                </Picker>
                <TextInput
                    label="Zip Code"
                    value={postalCode.substring(0, 5)}
                    onChangeText={(text) => onChange('postalCode', text)}
                    hideIcon
                    disabled={disabled}
                />
            </FieldContainer>

            <FieldContainer key={`ProfileForm:Gender`}>
                <H4>Gender</H4>
                <Radio
                    label=""
                    type="radio"
                    value={gender}
                    onChange={(gender) => onChange('gender', gender)}
                    disabled={disabled}
                >
                    {genderList.map((gender) => (
                        <RadioButton
                            key={gender}
                            value={gender}
                            label={gender}
                            underline={false}
                        />
                    ))}
                </Radio>
            </FieldContainer>

            <FieldContainer key={`ProfileForm:Birthday`}>
                <H4>Birthday</H4>
                <DateInput
                    label=""
                    value={
                        moment(birthDate).isValid()
                            ? moment(birthDate).format('MMM D, YYYY')
                            : ''
                    }
                    displayValue={
                        moment(birthDate).isValid()
                            ? moment(birthDate).format('MMM D, YYYY')
                            : ''
                    }
                    onConfirm={(birthDate) => onChange('birthDate', birthDate)}
                    disabled={disabled}
                />
            </FieldContainer>
        </ContentContainer>
    );
};

EditUserProfile.defaultProps = {
    genderList: ['Male', 'Female'],
    onChange: () => null,
    street1: '',
    city: '',
    state: '',
    postalCode: '',
    birthDate: '',
    gender: '',
    campus: '',
    isLoading: false,
};

EditUserProfile.propTypes = {
    genderList: PropTypes.arrayOf(PropTypes.string),
    street1: PropTypes.string,
    city: PropTypes.string,
    state: PropTypes.string,
    postalCode: PropTypes.string,
    birthDate: PropTypes.string,
    gender: PropTypes.string,
    campus: PropTypes.string,
    isLoading: PropTypes.bool,
    onChange: PropTypes.func,
};

export default withNavigation(EditUserProfile);
