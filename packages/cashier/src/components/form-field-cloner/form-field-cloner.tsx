import React from 'react';
import { Formik, Field, FieldProps } from 'formik';
import { Button, Input, Icon } from '@deriv/components';
import { TReactChangeEvent } from 'Types';

type TFormFieldClonerProps = {
    name: string;
    value: string[];
    display_name: string;
    onChangeValueHandlerToParent: (values: string[]) => void;
};

const FormFieldCloner = ({ name, value, display_name, onChangeValueHandlerToParent }: TFormFieldClonerProps) => {
    const [fieldValue, setFieldValue] = React.useState<string[]>(value);

    const onChangeValueHandler = (e: TReactChangeEvent, idx: number) => {
        const fieldsValueArray = [...fieldValue];
        fieldsValueArray[idx] = e.target.value;
        setFieldValue(fieldsValueArray);
    };

    const addNewField = () => setFieldValue(prev => [...prev, 'Hi']);

    const removeField = (index: number) => {
        if (index === 0) {
            setFieldValue(['']);
        } else {
            setFieldValue(prev => prev.filter((_, i) => i !== index));
        }
    };

    const onSubmit = () => {
        // console.log('Form Submit');
    };

    React.useEffect(() => {
        onChangeValueHandlerToParent(fieldValue);
    }, [onChangeValueHandlerToParent, fieldValue]);

    return (
        <React.Fragment>
            <Formik
                initialValues={{
                    value: fieldValue || '',
                }}
                onSubmit={() => {
                    onSubmit();
                }}
            >
                <Field name={name}>
                    {({ field }: FieldProps<string>) => {
                        return fieldValue.map((_, idx) => {
                            return (
                                <div className='form-field-cloner__item' key={idx}>
                                    <Input
                                        {...field}
                                        onChange={(e: TReactChangeEvent) => onChangeValueHandler(e, idx)}
                                        value={fieldValue[idx]}
                                        className='form-field-cloner'
                                        label={display_name}
                                    />
                                    <Button
                                        onClick={() => removeField(idx)}
                                        primary_light
                                        large
                                        icon={<Icon color='brand' icon={'IcMinus'} size={16} />}
                                    />
                                    {idx === fieldValue.length - 1 && (
                                        <Button
                                            onClick={() => addNewField()}
                                            primary_light
                                            large
                                            icon={<Icon color='brand' icon={'IcAdd'} size={16} />}
                                        />
                                    )}
                                </div>
                            );
                        });
                    }}
                </Field>
            </Formik>
        </React.Fragment>
    );
};

export default FormFieldCloner;
