import PropTypes from 'prop-types';
import React from 'react';
import { Loading } from '@deriv/components';
import { connect } from 'Stores/connect';
import CashierLocked from 'Components/cashier-locked';
import { Virtual } from 'Components/cashier-container';
// import PaymentAgentList from './payment-agent-list';
import FormFieldCloner from 'Components/form-field-cloner';

const PaymentAgent = ({
    container,
    is_cashier_locked,
    is_payment_agent_withdraw,
    is_switching,
    is_virtual,
    payment_agent_active_tab_index,
    setActiveTab,
    setPaymentAgentActiveTabIndex,
    verification_code,
}) => {
    const initial_active_index =
        verification_code || is_payment_agent_withdraw || payment_agent_active_tab_index ? 1 : 0;
    setPaymentAgentActiveTabIndex(initial_active_index);

    React.useEffect(() => {
        setActiveTab(container);
        return () => {
            setPaymentAgentActiveTabIndex(0);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // eslint-disable-next-line no-unused-vars
    const onChangeValueHandlerToParent = values => {
        // console.log('🚀 ~ file: payment-agent.jsx ~ line 34 ~ values', values);
    };

    if (is_switching) {
        return <Loading />;
    }

    if (is_virtual) {
        return <Virtual />;
    }
    if (is_cashier_locked) {
        return <CashierLocked />;
    }
    return (
        <React.Fragment>
            <FormFieldCloner
                onChangeValueHandlerToParent={onChangeValueHandlerToParent}
                name='email'
                value={['Hamid from props']}
                display_name='Email address*'
            />
            {/* <PaymentAgentList
                verification_code={verification_code}
                is_payment_agent_withdraw={is_payment_agent_withdraw}
            /> */}
        </React.Fragment>
    );
};

PaymentAgent.propTypes = {
    container: PropTypes.string,
    is_cashier_locked: PropTypes.bool,
    is_payment_agent_withdraw: PropTypes.bool,
    is_switching: PropTypes.bool,
    is_virtual: PropTypes.bool,
    payment_agent_active_tab_index: PropTypes.number,
    setActiveTab: PropTypes.func,
    setPaymentAgentActiveTabIndex: PropTypes.func,
    verification_code: PropTypes.string,
};

export default connect(({ client, modules }) => ({
    container: modules.cashier.payment_agent.container,
    is_cashier_locked: modules.cashier.general_store.is_cashier_locked,
    is_switching: client.is_switching,
    is_virtual: client.is_virtual,
    is_payment_agent_withdraw: modules.cashier.payment_agent.is_withdraw,
    payment_agent_active_tab_index: modules.cashier.payment_agent.active_tab_index,
    setActiveTab: modules.cashier.general_store.setActiveTab,
    setPaymentAgentActiveTabIndex: modules.cashier.payment_agent.setActiveTabIndex,
    verification_code: client.verification_code.payment_agent_withdraw,
}))(PaymentAgent);
