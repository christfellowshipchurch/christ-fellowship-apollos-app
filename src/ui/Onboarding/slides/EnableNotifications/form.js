import React from 'react';
import PropTypes from 'prop-types';
import { has, get } from 'lodash'
import { KeyboardAvoidingView, StyleSheet, ScrollView } from 'react-native';
import moment from 'moment';
import {
    styled,
    H6,
    PaddedView,
    TextInput,
    Button,
    RadioButton
} from '@apollosproject/ui-kit';

import {
    FlexedSafeAreaView,
    TitleText,
    PromptText,
    BrandIcon,
} from '../styles.js';

const LegalText = styled(
    ({ theme }) => ({
        color: theme.colors.text.tertiary,
    }),
    'ui-auth.SMSLandingPage.LegalText'
)(H6);

import {
    StyledRadio,
    RadioLabel,
    Label,
    StyledDate
} from '../styles'

const ProfileInformationForm =
    ({
        values,
        touched,
        errors,
        setFieldValue,
        isLoading,
        genderList,
        defaultDate,
        buttonText,
        handleSubmit,
        disabled,
        isSubmitting,
        titleText,
        promptText,
        requiredFieldText
    }) => {
        let LastNameInput = null;

        return (
            <KeyboardAvoidingView style={StyleSheet.absoluteFill} behavior={'padding'}>
                <FlexedSafeAreaView>
                    <ScrollView>
                        <PaddedView>
                            <BrandIcon />
                            <TitleText>{titleText}</TitleText>
                            <PromptText padded>
                                {promptText}
                            </PromptText>
                            <TextInput
                                label={'First Name*'}
                                type={'text'}
                                returnKeyType={'next'}
                                value={get(values, 'firstName')}
                                error={
                                    get(touched, 'firstName', false) &&
                                    get(errors, 'firstName', null)
                                }
                                onChangeText={(text) => setFieldValue('firstName', text)}
                                onSubmitEditing={() => LastNameInput.focus()}
                                disabled={isLoading}
                                enablesReturnKeyAutomatically
                            />
                            <TextInput
                                label={'Last Name*'}
                                type={'text'}
                                returnKeyType={'next'}
                                value={get(values, 'lastName')}
                                error={
                                    get(touched, 'lastName', false) &&
                                    get(errors, 'lastName', null)
                                }
                                onChangeText={(text) => setFieldValue('lastName', text)}
                                disabled={isLoading}
                                enablesReturnKeyAutomatically
                                inputRef={(r) => {
                                    LastNameInput = r;
                                }}
                            />

                            <Label padded>Gender</Label>
                            <StyledRadio
                                label="Gender"
                                type="radio"
                                value={get(values, 'gender')}
                                error={get(touched, 'gender') && get(errors, 'gender')}
                                onChange={(value) => setFieldValue('gender', value)}
                            >
                                {genderList.map((gender) => [
                                    <RadioButton
                                        key={gender}
                                        value={gender}
                                        label={() => <RadioLabel>{gender}</RadioLabel>}
                                        underline={false}
                                    />,
                                ])}
                            </StyledRadio>

                            <Label>Birthday</Label>
                            <StyledDate
                                type={'DateInput'}
                                placeholder={'Select date of birth...'}
                                value={moment
                                    .utc(get(values, 'birthDate', defaultDate) || defaultDate)
                                    .toDate()}
                                error={get(touched, 'birthDate') && get(errors, 'birthDate')}
                                displayValue={
                                    // only show a birthday if we have one.
                                    get(values, 'birthDate', '') // DatePicker shows displayValue > placeholder > label in that order
                                        ? moment(values.birthDate).format('MM/DD/YYYY')
                                        : '' // Pass an empty string if we don't have a birthday to show the placeholder.
                                }
                                onChange={(value) => setFieldValue('birthDate', value)}
                            />
                            <LegalText>{requiredFieldText}</LegalText>
                        </PaddedView>
                    </ScrollView>

                    <PaddedView>
                        <Button
                            title={buttonText}
                            onPress={handleSubmit}
                            disabled={disabled}
                            loading={isSubmitting}
                        />
                    </PaddedView>
                </FlexedSafeAreaView>
            </KeyboardAvoidingView>
        );
    }

ProfileInformationForm.propTypes = {
    /* The `Swiper` component used in `<Onboading>` looks for and hijacks the title prop of it's
     * children. Thus we have to use more unique name.
     */
    setFieldValue: PropTypes.func.isRequired,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    touched: PropTypes.shape({}),
    errors: PropTypes.shape({}),
    values: PropTypes.shape({}),
    isLoading: PropTypes.bool,
    genderList: PropTypes.arrayOf(PropTypes.string),
    defaultDate: PropTypes.instanceOf(Date),
};

ProfileInformationForm.defaultProps = {
    genderList: ['Male', 'Female'],
    defaultDate: new Date(),
    buttonText: 'Next',
    titleText: "Let's get to know each other better",
    promptText: "In order for us to get you the blah blah blah. So let's go ahead and bleedidy doopody dee",
    requiredFieldText: "*indicates a required field"
};

ProfileInformationForm.displayName = 'ProfileInformationForm';

export default ProfileInformationForm;
