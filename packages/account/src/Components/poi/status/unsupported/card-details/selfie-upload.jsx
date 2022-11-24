import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Formik, Form } from 'formik';
import { localize } from '@deriv/translations';
import { isMobile } from '@deriv/shared';
import { Button, Icon, Text } from '@deriv/components';
import Uploader from './uploader.jsx';
import { setInitialValues, validateFields } from './utils';
import { ROOT_CLASS, SELFIE_DOCUMENT } from '../constants';

const SelfieUpload = ({ initial_values, is_pa_signup, goBack, onConfirm, onFileDrop, setIsSelfieStepEnabled }) => {
    const [formik_values, setFormikValues] = React.useState({});

    React.useEffect(() => {
        if (typeof setIsSelfieStepEnabled === 'function') setIsSelfieStepEnabled(formik_values[SELFIE_DOCUMENT.name]);
    }, [formik_values, setIsSelfieStepEnabled]);

    const selfie_header_for_pa_signup = (
        <>
            {!isMobile() ? (
                <Text as='h2' size='m' weight='bold' color='prominent'>
                    {localize('Selfie verification')}
                </Text>
            ) : null}
            <Text as='p' size='xs' color='prominent'>
                {localize("First, we'll need to verify your identity. Please upload your selfie here.")}
            </Text>
        </>
    );

    return (
        <div
            className={classNames(ROOT_CLASS, {
                [`${ROOT_CLASS}--mobile`]: isMobile(),
            })}
        >
            <Formik
                initialValues={initial_values || setInitialValues([SELFIE_DOCUMENT])}
                validate={values => validateFields(values, undefined, [SELFIE_DOCUMENT])}
                onSubmit={onConfirm}
                innerRef={formik_actions =>
                    formik_actions ? setFormikValues(formik_actions.values) : setFormikValues({})
                }
            >
                {({ values, isValid, isSubmitting, touched }) => {
                    const is_form_touched = Object.keys(touched).length > 0;
                    const is_form_empty = Object.values(values).some(field => field === null || field === '');

                    return (
                        <Form className={`${ROOT_CLASS}__form`}>
                            <div className={`${ROOT_CLASS}__fields-content`}>
                                {is_pa_signup ? (
                                    selfie_header_for_pa_signup
                                ) : (
                                    <Text as='h3' size='s' weight='bold' color='prominent'>
                                        {localize('Upload your selfie')}
                                    </Text>
                                )}
                                <div className={`${ROOT_CLASS}__uploaders-wrap`}>
                                    <Uploader
                                        data={SELFIE_DOCUMENT}
                                        value={values[SELFIE_DOCUMENT.name]}
                                        is_full={true}
                                        onChange={onFileDrop}
                                        has_frame
                                    />
                                </div>
                                <div className={`${ROOT_CLASS}__notice`}>
                                    {is_pa_signup ? (
                                        <Text as='p' size='xs' color='general'>
                                            {localize(
                                                'Face forward and remove your glasses if necessary. Make sure your eyes are clearly visible and your face is within the frame.'
                                            )}
                                        </Text>
                                    ) : (
                                        <Text as='p' size='xs' color='general'>
                                            {localize(
                                                'Before uploading, please ensure that you’re facing forward in the selfie, your face is within the frame, and your eyes are clearly visible even if you’re wearing glasses.'
                                            )}
                                        </Text>
                                    )}
                                </div>
                            </div>
                            {!is_pa_signup && (
                                <div className={`${ROOT_CLASS}__btns`}>
                                    <Button
                                        onClick={goBack}
                                        secondary
                                        large
                                        text={localize('Go back')}
                                        icon={<Icon icon={'IcButtonBack'} size={16} />}
                                    />
                                    <Button
                                        type='submit'
                                        primary
                                        large
                                        is_disabled={!isValid || isSubmitting || (!is_form_touched && is_form_empty)}
                                        text={localize('Confirm and upload')}
                                    />
                                </div>
                            )}
                        </Form>
                    );
                }}
            </Formik>
        </div>
    );
};

SelfieUpload.propTypes = {
    initial_values: PropTypes.object,
    is_pa_signup: PropTypes.bool,
    goBack: PropTypes.func,
    onConfirm: PropTypes.func,
    setIsSelfieStepEnabled: PropTypes.func,
};

export default SelfieUpload;
