import React, { memo } from 'react';
import { Query, Mutation } from 'react-apollo';
import { Formik } from 'formik';
import * as Yup from 'yup';
import PropTypes from 'prop-types';

import getUserProfile from '../../../../tabs/connect/getUserProfile';
import AskName from './AskName';

import updateUserName from './updateUserName';

// eslint-disable-next-line react/display-name
const AskNameConnected = memo(({ onPressPrimary, ...props }) => (
  <Query query={getUserProfile}>
    {({ data: { currentUser = { profile: {} } } = {} }) => {
      const { firstName, lastName } = currentUser.profile;
      return (
        <Mutation
          mutation={updateUserName}
          update={async (cache, { data: { updateProfileFields } }) => {
            await cache.writeQuery({
              query: getUserProfile,
              data: {
                currentUser: {
                  ...currentUser,
                  profile: {
                    ...currentUser.profile,
                    firstName: updateProfileFields.firstName,
                    lastName: updateProfileFields.lastName,
                  },
                },
              },
            });
          }}
        >
          {(updateName) => (
            <Formik
              initialValues={{ firstName, lastName }}
              validationSchema={Yup.object().shape({
                firstName: Yup.string().required('First Name is required!'),
                lastName: Yup.string().required('Last Name is required!'),
              })}
              enableReinitialize
              onSubmit={async (variables, { setSubmitting, setFieldError }) => {
                try {
                  await updateName({ variables });
                } catch (e) {
                  const { graphQLErrors } = e;
                  if (
                    graphQLErrors.length &&
                    graphQLErrors.find(({ message }) =>
                      message.includes('User already exists')
                    )
                  ) {
                    setFieldError(
                      'firstName',
                      'There was a problem sending your request'
                    );
                  } else {
                    setFieldError(
                      'firstName',
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
                  <AskName
                    onPressPrimary={handleOnPressPrimary}
                    firstName={firstName}
                    lastName={lastName}
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

AskNameConnected.propTypes = {
  onPressPrimary: PropTypes.func,
};

export default AskNameConnected;
