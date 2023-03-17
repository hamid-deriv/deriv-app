import React from 'react';
import { Dialog } from '@deriv/components';
import { isCryptocurrency } from '@deriv/shared';
import { useHasFiatAccount } from '@deriv/hooks';
import { localize, Localize } from '@deriv/translations';
import { useStore, observer } from '@deriv/stores';
import { useCashierStore } from 'Stores/useCashierStores';

type TAccountPromptDialogProps = {
    last_location: string | null;
    onClose: VoidFunction;
};

const AccountPromptDialog = observer(({ last_location = null, onClose }: TAccountPromptDialogProps) => {
    const { has_fiat_account, non_crypto_loginid } = useHasFiatAccount();
    const { client, common } = useStore();
    const { accounts } = client;
    const { general_store } = useCashierStore();
    const non_crypto_currency = non_crypto_loginid && accounts[non_crypto_loginid].currency;

    const onConfirm = async () => {
        onClose();
        if (last_location) {
            common.routeTo(last_location);
        }
        if (isCryptocurrency(client?.currency) && has_fiat_account) {
            client.switchAccount(non_crypto_loginid);
            // general_store.setIsDeposit(true);
        }
    };

    return (
        <Dialog
            className='acc-prompt-dialog'
            title={localize('Switch account?')}
            confirm_button_text={localize('Switch account')}
            cancel_button_text={localize('Cancel')}
            onConfirm={onConfirm}
            onCancel={onClose}
            is_visible={!!last_location}
            dismissable={false}
            has_close_icon={false}
            portal_element_id='modal_root'
        >
            <Localize
                i18n_default_text='To deposit money, please switch to your {{currency_symbol}} account.'
                values={{
                    currency_symbol: non_crypto_currency?.toUpperCase(),
                }}
            />
        </Dialog>
    );
});

export default AccountPromptDialog;
