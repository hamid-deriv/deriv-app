import React from 'react';
import ReactDOM from 'react-dom';
import { observer } from 'mobx-react-lite';
import { Button, Icon, Text } from '@deriv/components';
import getNote from './signup-side-note-provider';
import { useHistory } from 'react-router';
import { useStore } from '../../../../hooks';
import SignupWizard from '../signup-wizard';
import './signup-side-note.scss';

export type TNote = {
    button_text?: JSX.Element;
    description: JSX.Element;
    icon?: string;
    is_primary_button?: boolean;
    is_primary_light_button?: boolean;
    onClick?: VoidFunction;
    title: JSX.Element;
    title_color?: string;
};

const Note = ({ note }: { note: TNote }) => {
    return (
        <div className='signup-side-note'>
            <div className='signup-side-note__header'>
                {note.icon && <Icon icon={note.icon} size={16} />}
                <Text as='p' color={note.title_color} size='xxs' line-height='m' weight='bold'>
                    {note.title}
                </Text>
            </div>
            <Text as='p' className='signup-side-note__description' size='xxxs' line-height='s'>
                {note.description}
            </Text>
            {note.button_text && (
                <Button
                    type='button'
                    primary={note.is_primary_button}
                    primary_light={note.is_primary_light_button}
                    small
                    onClick={note.onClick}
                >
                    {note.button_text}
                </Button>
            )}
        </div>
    );
};

const SignupSideNote = () => {
    const history = useHistory();

    const [is_wizard_open, setIsWizardOpen] = React.useState(false);
    const [paymentagent_details, setPaymentAgentDetails] = React.useState({});

    const { client } = useStore();

    const {
        website_status: {
            payment_agents: { initial_deposit_per_country },
        },
        account_settings: { country_code },
    } = client;

    const wizard_root_el = document.getElementById('wizard_root');

    const closeWizard = () => {
        setIsWizardOpen(false);
    };

    const openWizard = () => {
        setIsWizardOpen(true);
    };

    const note = React.useMemo(
        () => getNote({ country_code, history, initial_deposit_per_country, openWizard, paymentagent_details }),
        [history, paymentagent_details, country_code, initial_deposit_per_country]
    );

    return (
        <>
            <Note note={note} />
            {is_wizard_open &&
                wizard_root_el &&
                ReactDOM.createPortal(<SignupWizard closeWizard={closeWizard} />, wizard_root_el)}
        </>
    );
};

export default observer(SignupSideNote);
