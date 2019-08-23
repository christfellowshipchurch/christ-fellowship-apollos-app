import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Text } from 'react-native'
import { useQuery } from 'react-apollo'
import { withFormik } from 'formik'
import * as Yup from 'yup'
import { has, get } from 'lodash'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { Avatar } from 'ChristFellowship/src/ui/UserAvatarHeader'

import {
    PaddedView,
    FlexedView,
    H4,
    H6,
} from '@apollosproject/ui-kit'
import { FormCard } from 'ChristFellowship/src/ui/Cards'

import { GET_SPOUSE } from './queries'

const SpouseForm = ({
    isSubmitting = true,
    setSubmitting,
    setFieldValue,
    errors,
    values,
}) => {
    const { loading, error, data: { getSpouse } } = useQuery(GET_SPOUSE, { fetchPolicy: 'cache-and-network' })

    if (error) return <H6>There was an error</H6>

    return (
        <FormCard title={get(values, 'title')} isLoading={loading}>
            {has(getSpouse, 'id')
                ? <FlexedView style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                }}>
                    <Avatar source={get(getSpouse, 'photo')} size='small' />
                    <PaddedView>
                        <H4>{`${get(getSpouse, 'firstName')} ${get(getSpouse, 'lastName')}`}</H4>
                    </PaddedView>
                    <FlexedView style={{ alignItems: 'flex-end' }}>
                        <FontAwesomeIcon icon={['fal', 'times-circle']} size={18} />
                    </FlexedView>
                </FlexedView>
                : <H4>Have you heard of Young Adults?</H4>}
        </FormCard>
    )
}

const FormikForm = ({
    onSubmit,
    initialValues,
    isInitialValid,
    title
}) => {
    const Form = withFormik({
        mapPropsToValues: () => ({ ...initialValues, title }),
        onSubmit,
        initialValues: { ...initialValues, title },
        isInitialValid,
    })(SpouseForm)

    return <Form />
}

export default FormikForm