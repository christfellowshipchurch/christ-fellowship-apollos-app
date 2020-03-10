import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { useQuery, useMutation } from '@apollo/react-hooks';
import Color from 'color';

import {
    styled,
    H4,
    PaddedView,
    ActivityIndicator,
    FlexedView,
} from '@apollosproject/ui-kit';

import {
    CURRENT_USER,
    UPDATE_PROFILE_FIELDS,
    UPDATE_COMMUNCATION_PREFERENCE,
} from '../profile';
import { TextInput, Switch } from '../ui/inputs';

import { useForm } from '../hooks';

const Container = styled(({ theme }) => ({
    marginVertical: theme.sizing.baseUnit * 0.5,
}))(View);

const Overlay = styled(({ theme }) => ({
    alignContent: 'center',
    justifyContent: 'center',
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: Color(theme.colors.background.screen).fade(0.25),
    top: 0,
    left: 0,
    zIndex: 1,
}))(FlexedView);

const PersonalInformation = ({
    email,
    phoneNumber,
    allowEmail,
    allowSMS,
    isLoading,
}) => {
    const update = (cache, data) => {
        // read the CURRENT_USER query
        const { currentUser } = cache.readQuery({ query: CURRENT_USER });
        // write to the cache the results of the current cache
        //  and append any new fields that have been returned from the mutation
        cache.writeQuery({
            query: CURRENT_USER,
            data: {
                currentUser: {
                    ...currentUser,
                    profile: {
                        ...currentUser.profile,
                        ...data,
                    },
                },
            },
        });
    };
    const [
        updatePersonalInformation,
        { loading: loadingProfileFields },
    ] = useMutation(UPDATE_PROFILE_FIELDS, {
        update: async (cache, { data: { updateProfileFields } }) => {
            const {
                email: updatedEmail,
                phoneNumber: updatedPhoneNumber,
            } = updateProfileFields;
            update(cache, { email: updatedEmail, phoneNumber: updatedPhoneNumber });
        },
    });
    const [
        updateCommunicationPreference,
        { loading: loadingCommPref },
    ] = useMutation(UPDATE_COMMUNCATION_PREFERENCE, {
        update: async (cache, { data: { updateCommunicationPreference } }) => {
            const { communicationPreferences } = updateCommunicationPreference;
            update(cache, { communicationPreferences });
        },
    });

    const { values, setValue } = useForm({
        defaultValues: {
            email,
            phoneNumber,
            allowEmail,
            allowSMS,
        },
    });

    const loading = isLoading || loadingProfileFields || loadingCommPref;

    return (
        <PaddedView>
            <H4>Personal Information</H4>
            <View>
                {loading && (
                    <Overlay>
                        <ActivityIndicator />
                    </Overlay>
                )}
                <Container>
                    <TextInput
                        label={'Email'}
                        type={'email'}
                        textContentType={'emailAddress'} // ios autofill
                        returnKeyType={'done'}
                        value={values.email}
                        icon="envelope"
                        disabled={loading}
                        onChangeText={(value) => setValue('email', value)}
                        onSubmitEditing={() =>
                            updatePersonalInformation({
                                variables: {
                                    profileFields: [{ field: 'Email', value: values.email }],
                                },
                            })
                        }
                    />
                    <Switch
                        icon="envelope-open-text"
                        label={'Allow Email Notifications'}
                        value={values.allowEmail}
                        disabled={loading}
                        onValueChange={(value) => {
                            setValue('allowEmail', value);
                            updateCommunicationPreference({
                                variables: { type: 'Email', allow: value },
                            });
                        }}
                    />
                </Container>
                <Container>
                    <TextInput
                        label={'Mobile Phone'}
                        type={'number'}
                        textContentType={'telephoneNumber'} // ios autofill
                        returnKeyType={'done'}
                        value={values.phoneNumber}
                        icon="mobile"
                        disabled={loading}
                        onChangeText={(value) => setValue('phoneNumber', value)}
                        onSubmitEditing={() =>
                            updatePersonalInformation({
                                variables: {
                                    profileFields: [
                                        { field: 'PhoneNumber', value: values.phoneNumber },
                                    ],
                                },
                            })
                        }
                    />
                    <Switch
                        icon="comment-lines"
                        label={'Allow Text Notifications'}
                        value={values.allowSMS}
                        disabled={loading}
                        onValueChange={(value) => {
                            setValue('allowSMS', value);
                            updateCommunicationPreference({
                                variables: { type: 'SMS', allow: value },
                            });
                        }}
                    />
                </Container>
            </View>
        </PaddedView>
    );
};

PersonalInformation.propTypes = {
    email: PropTypes.string,
    phoneNumber: PropTypes.string,
    allowEmail: PropTypes.bool,
    allowSMS: PropTypes.bool,
    isLoading: PropTypes.bool,
};

const PersonalInformationConnected = () => {
    const {
        loading,
        data: {
            currentUser: {
                profile: {
                    email,
                    phoneNumber,
                    communicationPreferences: { allowSMS, allowEmail } = {},
                } = {},
            } = {},
        } = {},
    } = useQuery(CURRENT_USER, {
        fetchPolicy: 'cache-and-network',
    });

    return (
        <PersonalInformation
            email={email}
            phoneNumber={phoneNumber}
            allowEmail={allowEmail}
            allowSMS={allowSMS}
            isLoading={loading}
        />
    );
};

export default PersonalInformationConnected;
