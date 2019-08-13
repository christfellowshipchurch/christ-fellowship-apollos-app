import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { SafeAreaView } from 'react-native'
import { Mutation } from 'react-apollo'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { has, get } from 'lodash'

import {
  Button,
  ButtonLink,
  TextInput,
  BackgroundView,
  PaddedView,
  FlexedView,
  styled,
} from '@apollosproject/ui-kit'

import GET_AUTH_TOKEN from 'ChristFellowship/src/store/getAuthToken'
import CHANGE_PASSWORD from './passwordChange'


class ChangePassword extends PureComponent {
  static navigationOptions = ({ navigation }) => ({
    title: 'Change Password',
    headerLeft: null,
    headerRight: (
      <PaddedView vertical={false}>
        <ButtonLink onPress={() => navigation.goBack()}>Cancel</ButtonLink>
      </PaddedView>
    ),
  })

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
      navigate: PropTypes.func,
      goBack: PropTypes.func,
    }),
  }

  renderForm = ({
    isSubmitting,
    setFieldValue,
    errors,
    values,
    touched,
    handleSubmit
  }) => {
    const disabled = isSubmitting
      || get(values, 'password', '') === ''
      || get(values, 'confirmPassword', '') === ''
      || has(errors, 'password')
      || has(errors, 'confirmPassword')
      || true

    return (
      <FlexedView>
        <BackgroundView>
          <PaddedView>
            <TextInput
              label="New Password"
              type="password"
              value={values.password}
              error={touched.password && errors.password}
              onChangeText={(text) => setFieldValue('password', text)}
            />
            <TextInput
              label="Confirm Password"
              type="password"
              value={values.confirmPassword}
              error={
                touched.confirmPassword && errors.confirmPassword
              }
              onChangeText={(text) =>
                setFieldValue('confirmPassword', text)
              }
            />

            <Button
              disabled={disabled}
              onPress={handleSubmit}
              title="Update Password"
              loading={isSubmitting}
            />
          </PaddedView>
        </BackgroundView>
      </FlexedView>
    )
  }

  render() {
    return (
      <Mutation
        mutation={CHANGE_PASSWORD}
        update={async (cache, { data: { token } }) => {
          await cache.writeQuery({
            query: GET_AUTH_TOKEN,
            data: { authToken: token },
          })

          await cache.writeData({
            data: { authToken: token },
          })
        }}
      >
        {(updatePassword) => (
          <Formik
            validationSchema={Yup.object().shape({
              password: Yup.string()
                .min(6, 'Password must be at least 6 characters')
                .required('Password is required'),
              confirmPassword: Yup.string()
                .min(6, 'Password must be at least 6 characters')
                .oneOf([Yup.ref('password')], 'Passwords must match.')
                .required('Password confirm is required'),
            })}
            onSubmit={async (variables, { setSubmitting, setFieldError }) => {
              try {
                await updatePassword({ variables })

                // await this.props.navigation.goBack()
              } catch (e) {
                const { graphQLErrors } = e
                if (graphQLErrors && graphQLErrors.length) {
                  setFieldError(
                    'confirmPassword',
                    'Unknown error. Please try again later.'
                  )
                }
              }
              setSubmitting(false)
            }}
          >
            {this.renderForm}
          </Formik>
        )}
      </Mutation>
    )
  }
}

export default ChangePassword
