import React, { useState } from 'react'
import { useQuery } from 'react-apollo'
import { withNavigation } from 'react-navigation'
import PropTypes from 'prop-types'
import { get } from "lodash"
import moment from 'moment'

import { useForm } from 'ChristFellowship/src/hooks'

import {
    H4,
    BodyText
} from '@apollosproject/ui-kit'

import {
    TextInput,
    DateInput,
    Picker,
    PickerItem,
    Radio,
    RadioButton,
    InputWrapper
} from 'ChristFellowship/src/ui/inputs'
import { ContentContainer, FieldContainer } from '../components'

import { CURRENT_USER_PROFILE } from '../queries'

const EditUserProfile = ({
    states,
    genderList,
    navigation,
    ...defaultValues
}) => {
    const {
        values,
        setValue
    } = useForm({ defaultValues })

    const onChange = (field, value) => setValue(field, value)
    const birthDate = get(values, 'birthDate', '')

    return [
        <FieldContainer key={`ProfileForm:Campus`}>
            <H4>
                Campus
            </H4>
            <InputWrapper
                displayValue={get(values, 'campus', '')}
                icon="church"
                handleOnPress={() => navigation.navigate('Location')}
            />
        </FieldContainer>,

        <FieldContainer key={`ProfileForm:HomeAddress`}>
            <H4>
                Home Address
            </H4>
            <TextInput
                label="Street Address"
                value={get(values, 'street1', '')}
                onChangeText={(text) => onChange('street1', text)}
                icon="home"
            />
            <TextInput
                label="Apt #"
                value={get(values, 'street2', '')}
                onChangeText={(text) => onChange('street2', text)}
                hideIcon
            />
            <TextInput
                label="City"
                value={get(values, 'city', '')}
                onChangeText={(text) => onChange('city', text)}
                hideIcon
            />
            <Picker
                label="State"
                value={get(values, 'state', '')}
                displayValue={get(values, 'state', '')}
                onValueChange={(state) => onChange('state', state)}
                hideIcon
            >
                {states.map((n, i) =>
                    <PickerItem label={n.value} value={n.value} key={i} />
                )}
            </Picker>
            <TextInput
                label="Zip Code"
                value={get(values, 'postalCode', '').substring(0, 5)}
                onChangeText={(text) => onChange('postalCode', text)}
                hideIcon
            />
        </FieldContainer>,

        <FieldContainer key={`ProfileForm:Gender`}>
            <H4>
                Gender
            </H4>
            <Radio
                label=""
                type="radio"
                value={get(values, 'gender', '')}
                onChange={(gender) => onChange('gender', gender)}
            >
                {genderList.map((gender) => [
                    <RadioButton
                        key={gender}
                        value={gender}
                        label={gender}
                        underline={false}
                    />,
                ])}
            </Radio>
        </FieldContainer>,

        <FieldContainer key={`ProfileForm:Birthday`}>
            <H4>
                Birthday
            </H4>
            <DateInput
                label=""
                value={moment(birthDate).isValid()
                    ? moment(birthDate).format('MMM D, YYYY')
                    : ''}
                displayValue={moment(birthDate).isValid()
                    ? moment(birthDate).format('MMM D, YYYY')
                    : ''}
                onConfirm={(birthDate) => onChange('birthDate', birthDate)}
            />
        </FieldContainer>
    ]
}

EditUserProfile.defaultProps = {
    defaultValues: {},
    states: [],
    genderList: ['Male', 'Female']
}

// const EditUserProfile = ({
//     navigation
// }) => {
//     const {
//         loading,
//         error,
//         data: {
//             currentUser: {
//                 profile,
//             } = {},
//             getStatesList = {}
//         } = {}
//     } = useQuery(
//         CURRENT_USER_PROFILE,
//         { fetchPolicy: "cache-and-network" }
//     )

//     return (
//         <ContentContainer>
//             <ProfileForm
//                 campus={get(profile, 'campus.name', '')}
//                 street1={get(profile, 'address.street1', '')}
//                 street2={get(profile, 'address.street2', '')}
//                 city={get(profile, 'address.city', '')}
//                 state={get(profile, 'address.state', '')}
//                 postalCode={get(profile, 'address.postalCode', '')}
//                 gender={get(profile, 'gender', '')}
//                 birthDate={get(profile, 'birthDate', '')}
//                 states={get(getStatesList, 'values', [])}
//                 navigation={navigation}
//             />
//         </ContentContainer>
//     )
// }

// EditUserProfile.defaultProps = {
//     firstName: '',
//     lastName: '',
//     photo: {
//         uri: '',
//     },
//     campus: {
//         name: '',
//         featuredImage: {
//             uri: '',
//         },
//     },
//     fields: [],
//     genderList: ['Male', 'Female']
// }

// EditUserProfile.propTypes = {
//     firstName: PropTypes.string,
//     lastName: PropTypes.string,
//     photo: PropTypes.shape({
//         uri: PropTypes.string,
//     }),
//     campus: PropTypes.shape({
//         name: PropTypes.string,
//         featuredImage: PropTypes.shape({
//             uri: PropTypes.string,
//         }),
//     }),
//     fields: PropTypes.arrayOf(
//         PropTypes.shape({
//             title: PropTypes.string,
//             content: PropTypes.oneOfType([
//                 PropTypes.string,
//                 PropTypes.arrayOf(
//                     PropTypes.string
//                 )
//             ]),
//         })
//     ),
//     genderList: PropTypes.arrayOf(PropTypes.string),
// }

export default withNavigation(EditUserProfile)
