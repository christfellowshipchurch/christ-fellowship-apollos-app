import React from 'react'
import { useQuery, useMutation } from 'react-apollo'
import { withNavigation } from 'react-navigation'
import { get, keys, upperFirst } from 'lodash'

import { useForm } from 'ChristFellowship/src/hooks'

import {
    ActivityIndicator,
} from '@apollosproject/ui-kit'

import ProfileHeader from './ProfileHeader'
import EditUserProfile from './EditUserProfile'

import { CURRENT_USER } from './queries'
import { UPDATE_CURRENT_USER } from './mutations'

const EditCurrentUserProfile = ({
    navigation,
    firstName,
    lastName,
    photo,
    campus,
    address: {
        street1,
        street2,
        city,
        state,
        postalCode
    } = {},
    gender,
    birthDate,
}) => {
    const {
        values,
        setValue,
    } = useForm({
        defaultValues: {
            street1,
            street2,
            city,
            state,
            postalCode,
            gender,
            birthDate
        }
    })
    const [updateProfile, { loading, error }] = useMutation(
        UPDATE_CURRENT_USER,
        {
            update: async (cache, { data: { updateProfileFields, updateAddress } }) => {
                // read the CURRENT_USER query
                const { currentUser } = cache.readQuery({ query: CURRENT_USER })
                const { birthDate, gender } = updateProfileFields
                // write to the cache the results of the current cache
                //  and append any new fields that have been returned from the mutation
                await cache.writeQuery({
                    query: CURRENT_USER,
                    data: {
                        currentUser: {
                            ...currentUser,
                            profile: {
                                ...currentUser.profile,
                                birthDate,
                                gender,
                                address: updateAddress
                            }
                        }
                    },
                })

                navigation.goBack()
            }
        }
    )

    return <ProfileHeader
        firstName={firstName}
        lastName={lastName}
        avatar={photo}
        featuredImage={campus.featuredImage}
        campus={campus.name}
        edit
        onCancel={() => navigation.goBack()}
        onSave={() => {
            const address = {
                street1: get(values, 'street1', ''),
                street2: get(values, 'street2', ''),
                city: get(values, 'city', ''),
                state: get(values, 'state', ''),
                postalCode: get(values, 'postalCode', ''),
            }
            const valueKeys = keys(values).filter(n => !keys(address).includes(n))
            const profileFields = valueKeys.map(n => ({ field: upperFirst(n), value: values[n] }))

            updateProfile({ variables: { address, profileFields } })
        }}
        isLoading={loading}
    >
        <EditUserProfile
            birthDate={get(values, 'birthDate', '')}
            street1={get(values, 'street1', '')}
            street2={get(values, 'street2', '')}
            city={get(values, 'city', '')}
            state={get(values, 'state', '')}
            postalCode={get(values, 'postalCode', '')}
            gender={get(values, 'gender', '')}
            campus={campus.name}
            onChange={(key, value) => setValue(key, value)}
            isLoading={loading}
        />
    </ProfileHeader>
}

const EditCurrentUserProfileConnected = ({ navigation }) => {
    const {
        loading,
        error,
        data: {
            currentUser: {
                profile
            } = {},
        } = {}
    } = useQuery(
        CURRENT_USER,
        {
            fetchPolicy: "cache-and-network",
        }
    )

    if (loading) return <ActivityIndicator />
    if (error) return null

    return <EditCurrentUserProfile
        {...profile}
        navigation={navigation}
    />
}

EditCurrentUserProfileConnected.navigationOptions = {
    header: null
}

export default withNavigation(EditCurrentUserProfileConnected)