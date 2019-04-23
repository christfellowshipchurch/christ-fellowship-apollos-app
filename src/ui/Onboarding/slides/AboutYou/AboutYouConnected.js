import React, { memo } from 'react';
import { Query, Mutation } from 'react-apollo';
import { Formik } from 'formik';
import * as Yup from 'yup';
import PropTypes from 'prop-types';

import getUserProfile from '../../../../tabs/connect/getUserProfile';
import AboutYou from './AboutYou';

import updateUserDetails from './updateUserDetails';

// eslint-disable-next-line react/display-name
const AboutYouConnected = memo(({ onPressPrimary, ...props }) => (
  <Query query={getUserProfile}>
    {({ data: { currentUser = { profile: {} } } = {} }) => {
      const { gender, birthDate } = currentUser.profile;

      return (
        <Mutation
          mutation={updateUserDetails}
          update={async (cache, { data: { updateProfileFields } }) => {
            await cache.writeQuery({
              query: getUserProfile,
              data: {
                currentUser: {
                  ...currentUser,
                  profile: {
                    ...currentUser.profile,
                    gender: updateProfileFields.gender,
                    birthDate: updateProfileFields.birthDate,
                  },
                },
              },
            });
          }}
        >
          {(updateDetails) => (
            <Formik
              initialValues={{ gender, birthDate }}
              validationSchema={Yup.object().shape({
                gender: Yup.string().required('Gender is required!'),
                birthDate: Yup.string().required('Birth Date is required!'),
              })}
              enableReinitialize
              onSubmit={async (variables, { setSubmitting, setFieldError }) => {
                try {
                  await updateDetails({ variables });
                } catch (e) {
                  const { graphQLErrors } = e;
                  if (
                    graphQLErrors.length &&
                    graphQLErrors.find(({ message }) =>
                      message.includes('Invalid')
                    )
                  ) {
                    setFieldError(
                      'gender',
                      'There was a problem sending your request'
                    );
                  } else {
                    setFieldError(
                      'gender',
                      'Unknown error. Please try again later.'
                    );
                  }
                }
                setSubmitting(false);
              }}
            >
              {({ submitForm, values, touched, errors, setFieldValue }) => {
                const handleOnPressPrimary = () => {
                  submitForm();
                  onPressPrimary();
                };
                return (
                  <AboutYou
                    onPressPrimary={handleOnPressPrimary}
                    gender={gender}
                    birthDate={birthDate}
                    values={values}
                    touched={touched}
                    errors={errors}
                    setFieldValue={setFieldValue}
                    {...props}
                  />
                );
              }}
            </Formik>
          )}
        </Mutation>
      );
    }}
  </Query>
));

AboutYouConnected.propTypes = {
  onPressPrimary: PropTypes.func,
};

export default AboutYouConnected;
