import React from 'react';
import { Field, FieldProps } from 'formik';
import { Input } from '@deriv/components';

type TFormFieldClonerProps = {
    name?: string;
    value?: string;
    display_name?: string;
    description?: string;
    setFieldValue: (value: string) => void;
};

const FormFieldCloner = ({ name, value, display_name, description, setFieldValue }: TFormFieldClonerProps) => {
    return (
        <Field name={name}>
            {({ field }: FieldProps) => (
                <Input
                    {...field}
                    onChange={() => setFieldValue(value || '')}
                    value={value}
                    className='form-field-cloner'
                    defaultChecked={value}
                    label={display_name}
                    description={description}
                />
            )}
        </Field>
    );
};

export default FormFieldCloner;
