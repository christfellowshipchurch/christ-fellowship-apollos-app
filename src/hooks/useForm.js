import { useState, useReducer } from 'react';
import { get } from 'lodash';

const valuesReducer = (values, newValue) =>
    newValue ? { ...values, ...newValue } : {};

const useForm = (props) => {
    // Deconstruct Properties
    const defaultValues = get(props, 'defaultValues', {});
    const validation = get(props, 'validation', {});

    // States
    // const [values, setValue] = useReducer(valuesReducer, defaultValues);
    const [values, setValues] = useState(defaultValues);
    const [errors, setError] = useReducer(valuesReducer, {});
    const [submitting, setSubmitting] = useState(false);

    // Effects

    // Methods
    const validateValue = async (key, value) => {
        let error = false;
        const validate = get(validation, key, null);

        if (validate) {
            const validationResponse = await validate(value, values);

            if (validationResponse) {
                error = validationResponse;
            }
        }

        return error;
    };

    const setValueByKey = async (key, value) => {
        const errorMsg = await validateValue(key, value);
        const errorObj = {};
        const keyValue = {};

        keyValue[key] = value;
        errorObj[key] = errorMsg;

        setValues({ ...values, keyValue });
        setError(errorObj);
    };

    const setErrorByKey = async (key, value) => {
        const errorObj = {};
        errorObj[key] = value;

        setError(errorObj);
    };

    const resetForm = () => {
        setValues(null);
        setError(null);
        setSubmitting(false);
    };

    // Return Values
    return {
        setValues,
        values,
        setValue: setValueByKey,
        errors,
        setError: setErrorByKey,
        submitting,
        setSubmitting,
        resetForm,
        overrideValues: setValueByKey,
    };
};

export default useForm;
