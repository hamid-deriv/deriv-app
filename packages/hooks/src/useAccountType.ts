import { useStore } from '@deriv/stores';
import { isCryptocurrency } from '@deriv/shared';

const useAccountType = () => {
    const { client } = useStore();
    const has_fiat_account = Object.values(client.accounts).some(
        acc_settings => !acc_settings.is_virtual && !isCryptocurrency(acc_settings.currency || '')
    );
    const non_crypto_loginid = Object.entries(client.accounts).reduce((initial_value, [loginid, settings]) => {
        return !settings.is_virtual && !isCryptocurrency(settings.currency || '') ? loginid : initial_value;
    }, '');

    return {
        has_fiat_account,
        non_crypto_loginid,
    };
};

export default useAccountType;
