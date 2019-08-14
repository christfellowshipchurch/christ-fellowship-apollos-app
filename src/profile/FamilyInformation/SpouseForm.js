import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Text } from 'react-native'
import { Query, Mutation } from 'react-apollo'
import { withFormik } from 'formik'
import * as Yup from 'yup'
import { has, get } from 'lodash'
import { Avatar } from 'ChristFellowship/src/ui/UserAvatarHeader'

import {
    ActivityIndicator,
    BackgroundView,
    PaddedView,
    FlexedView,
    styled,
    H4,
    H5,
    H6,
    Icon,
    Touchable,
} from '@apollosproject/ui-kit'

import { GET_SPOUSE } from './queries'

const ErrorMessage = styled(({ theme }) => ({
    color: theme.colors.alert
}))(H5)

const Label = styled(({ theme, padded }) => ({
    color: 'gray',
    opacity: 0.7,
    ...(padded ? { marginTop: theme.sizing.baseUnit } : {}),
}))(H6)

const Overlay = styled(() => ({
    alignContent: 'center',
    justifyContent: 'center',
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, .75)',
    top: 0,
    left: 0,
    zIndex: 1
}))(FlexedView)

const ActivityIndicatorOverlay = () => (
    <Overlay>
        <ActivityIndicator />
    </Overlay>
)

const SpouseForm = ({
    isSubmitting = true,
    setSubmitting,
    setFieldValue,
    errors,
    values,
}) => (
        <FlexedView>
            <BackgroundView>
                <PaddedView>
                    <Query query={GET_SPOUSE} fetchPolicy="cache-and-network">
                        {({ data: { getSpouse }, loading, error }) => {
                            if (loading) return <ActivityIndicatorOverlay />
                            if (error) return <H6>There was an error</H6>

                            const { id, firstName, lastName, photo } = getSpouse

                            return id
                                ? (
                                    <FlexedView style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                    }}>
                                        <Avatar source={photo} size='small' />
                                        <PaddedView>
                                            <H4>{`${firstName} ${lastName}`}</H4>
                                        </PaddedView>
                                        <FlexedView style={{ alignItems: 'flex-end' }}>
                                            <Icon name='close' size={18} />
                                        </FlexedView>
                                    </FlexedView>
                                ) : <H4>Have you heard of Young Adults?</H4>
                        }}
                    </Query>
                </PaddedView>
            </BackgroundView>
            {isSubmitting && <ActivityIndicatorOverlay />}
        </FlexedView>
    )

const FormikForm = ({
    onSubmit,
    initialValues,
    isInitialValid,
}) => {
    const Form = withFormik({
        mapPropsToValues: () => initialValues,
        onSubmit,
        initialValues,
        isInitialValid,
    })(SpouseForm)

    return <Form />
}

export default FormikForm