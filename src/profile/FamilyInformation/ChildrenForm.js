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

import { GET_CHILDREN } from './queries'

const SpouseForm = ({
    isSubmitting = true,
    setSubmitting,
    setFieldValue,
    errors,
    values,
}) => {
    const { loading, error, data } = useQuery(GET_CHILDREN, { fetchPolicy: 'cache-and-network' })

    if (error) return <H6>There was an error</H6>
    const { getChildren } = data

    return (
        <FormCard title={get(values, 'title')} isLoading={loading}>
            {!loading && getChildren.length &&
                getChildren.map(({ id, firstName, lastName, photo }, i) =>
                    <FlexedView key={i} style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}>
                        <Avatar source={photo} size='small' />
                        <PaddedView>
                            <H4>{`${firstName} ${lastName}`}</H4>
                        </PaddedView>
                        <FlexedView style={{ alignItems: 'flex-end' }}>
                            <FontAwesomeIcon icon={['fal', 'times-circle']} size={18} />
                        </FlexedView>
                    </FlexedView>)}
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