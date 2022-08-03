import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

// Utils
import { general_messages } from 'Constants/cfd-shared-strings';
import { connect } from 'Stores/connect';

// Components
import { Text, PageError, Tabs, Icon } from '@deriv/components';
import { CFD_PLATFORMS, getPlatformSettings, routes, isEmptyObject, isMobile } from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';
import Loading from '../templates/_common/components/loading';
import CFDAccountDisplay from 'Components/cfd-account-display';
import CFDMissingRealAccount from './cfd-missing-real-account';
import CFDPasswordManagerModal from './cfd-password-manager-modal';
import CFDAccountInfoModal from './cfd-account-info-modal';

// Types
import RootStore from 'Stores/index';
import { GetSettings } from '@deriv/api-types';

// Styles
import 'Sass/cfd-dashboard.scss';

// Add attribute to HTMLAttributes
declare module 'react' {
    interface HTMLAttributes<T> extends React.AriaAttributes, React.DOMAttributes<T> {
        label?: string;
        hash?: string;
    }
}

// In-page Types
type TMt5StatusServerType = {
    all: number;
    platform: number;
    server_number: number;
};
type TMt5StatusServer = Record<'demo' | 'real', TMt5StatusServerType[]>;

type TCFDDashboard = RouteComponentProps & {
    account_settings: GetSettings;
    beginRealSignupForMt5: () => void;
    dxtrade_accounts_list_error: null;
    dxtrade_disabled_signup_types: {
        real: boolean;
        demo: boolean;
    };
    has_dxtrade_demo_account_error: boolean;
    has_dxtrade_real_account_error: boolean;
    has_mt5_demo_account_error: boolean;
    has_mt5_real_account_error: boolean;
    has_real_account: boolean;
    is_eu: boolean;
    is_loading: boolean;
    is_logged_in: boolean;
    is_mt5_allowed: boolean;
    mt5_disabled_signup_types: {
        real: boolean;
        demo: boolean;
    };
    mt5_status_server: TMt5StatusServer;
    NotificationMessages: ({ ...props }) => JSX.Element;
    platform: 'mt5' | 'dxtrade';
    onMount: () => void;
    onUnmount: () => void;
    toggleCompareAccounts: () => void;
    upgradeable_landing_companies: unknown[];
};

// In-page Components
const LoadingCFDAccountDisplay = () => (
    <div className='cfd-real-accounts-display'>
        <Loading />
    </div>
);

const CFDDashboard = ({
    account_settings,
    beginRealSignupForMt5,
    dxtrade_accounts_list_error,
    dxtrade_disabled_signup_types,
    has_dxtrade_demo_account_error,
    has_dxtrade_real_account_error,
    has_mt5_demo_account_error,
    has_mt5_real_account_error,
    has_real_account,
    is_eu,
    is_loading,
    is_logged_in,
    is_mt5_allowed,
    mt5_disabled_signup_types,
    mt5_status_server,
    NotificationMessages,
    platform,
    onMount,
    onUnmount,
    upgradeable_landing_companies,
}: TCFDDashboard) => {
    // States
    const [active_index, setActiveIndex] = React.useState<number>(0);
    const [is_demo_enabled, setIsDemoEnabled] = React.useState<boolean>(false);
    const [is_real_enabled, setIsRealEnabled] = React.useState<boolean>(false);
    const [is_notification_loaded, setIsNotificationLoaded] = React.useState<boolean>(false);
    const [password_manager, setPasswordManager] = React.useState<{
        is_visible: boolean;
        selected_login: string;
        selected_account: string;
        selected_account_type?: string;
        selected_account_group?: string;
        selected_server?: string;
    }>({
        is_visible: false,
        selected_login: '',
        selected_account: '',
        selected_account_type: '',
        selected_account_group: '',
        selected_server: '',
    });

    // useEffects Hooks
    React.useEffect(() => {
        updateActiveIndex(getTabIndexToSet());
        // TODO: uncomment this after finding its usage
        // openResetPassword();
        onMount();
        return () => {
            onUnmount();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        // TODO: Check this, this is not available in the context hook
        // props.checkShouldOpenAccount();

        // TODO: Check the condition of enabling tabs
        if (is_logged_in) {
            ['demo', 'real'].forEach(account_type => {
                // TODO: What will happened on this condition?
                // const should_enable_tab =
                //     isSyntheticCardVisible(account_type) || isFinancialCardVisible() || isFinancialStpCardVisible();

                const should_enable_tab = true;

                if (account_type === 'real' && is_real_enabled !== should_enable_tab) {
                    setIsRealEnabled(should_enable_tab);
                }

                if (account_type === 'demo' && is_demo_enabled !== should_enable_tab) {
                    setIsDemoEnabled(should_enable_tab);
                }
            });
        }

        if (!is_logged_in && (!is_real_enabled || !is_demo_enabled)) {
            setIsRealEnabled(true);
            setIsDemoEnabled(true);
        }
        if (window.location.hash === '#demo') {
            setIsDemoEnabled(true);
            setActiveIndex(1);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Get Tab Index
    const getTabIndexToSet = () => {
        if (is_real_enabled || /real/.test(location.hash)) {
            return 0;
        }
        if (is_demo_enabled || /demo/.test(location.hash)) {
            return 1;
        }

        return undefined;
    };

    // Handle Active Tab
    const updateActiveIndex = (index?: number) => {
        if (index === undefined) return;
        const updated_state: { is_demo_tab?: boolean; active_index?: number } = {};
        // updateActiveIndex is called in componentDidUpdate causing tab_index to always revert back to 0
        updated_state.is_demo_tab = index === 1;
        updated_state.active_index = index;

        if (!isEmptyObject(updated_state)) {
            setActiveIndex(updated_state.active_index as number);
            setIsDemoEnabled(updated_state.is_demo_tab as boolean);
        }
    };

    // Suspend Check
    const getIsSuspendedMt5Server = (type_server: TMt5StatusServer['demo' | 'real']) =>
        type_server?.map((item: TMt5StatusServerType) => item.all).some((item: number) => item === 1);

    const is_suspended_mt5_demo_server = getIsSuspendedMt5Server(mt5_status_server?.demo);
    const is_suspended_mt5_real_server = getIsSuspendedMt5Server(mt5_status_server?.real);

    // Errors Check
    const has_mt5_account_error = is_demo_enabled
        ? is_suspended_mt5_demo_server || has_mt5_demo_account_error || mt5_disabled_signup_types.demo
        : is_suspended_mt5_real_server || has_mt5_real_account_error || mt5_disabled_signup_types.real;

    const has_dxtrade_account_error = is_demo_enabled
        ? has_dxtrade_demo_account_error || dxtrade_disabled_signup_types.demo
        : has_dxtrade_real_account_error || dxtrade_disabled_signup_types.real;

    const has_cfd_account_error =
        platform === CFD_PLATFORMS.MT5
            ? has_mt5_account_error
            : has_dxtrade_account_error || !!dxtrade_accounts_list_error;

    const should_show_missing_real_account =
        !is_eu && is_logged_in && !has_real_account && upgradeable_landing_companies?.length > 0;

    const togglePasswordManagerModal = (
        login?: string,
        title?: string,
        group?: string,
        type?: string,
        server?: string
    ) => {
        setPasswordManager(prev_state => ({
            is_visible: !prev_state.is_visible,
            selected_login: typeof login === 'string' ? login : '',
            selected_account: typeof title === 'string' ? title : '',
            selected_account_group: group,
            selected_account_type: type,
            selected_server: server,
        }));
    };

    // Component Template
    return (
        <>
            {is_mt5_allowed || platform === CFD_PLATFORMS.DXTRADE || !is_logged_in ? (
                <div className='cfd-dashboard'>
                    <NotificationMessages
                        is_mt5
                        is_notification_loaded={is_notification_loaded}
                        stopNotificationLoading={() => setIsNotificationLoaded(true)}
                    />

                    <div className='cfd-dashboard__welcome-message'>
                        <h1 className='cfd-dashboard__welcome-message--heading'>
                            {general_messages.getWelcomeHeader(is_logged_in, platform)}
                        </h1>
                    </div>

                    {is_logged_in && has_cfd_account_error && (
                        <div className='cfd-dashboard__accounts-error'>
                            <Text
                                as='p'
                                className='cfd-dashboard__accounts-error-message'
                                line_height='l'
                                size='xxs'
                                color='prominent'
                                weight='normal'
                                align='center'
                            >
                                <Localize
                                    i18n_default_text='Due to an issue on our server, some of your {{platform}} accounts are unavailable at the moment. Please bear with us and thank you for your patience.'
                                    values={{
                                        platform: getPlatformSettings(platform).name,
                                    }}
                                />
                            </Text>
                        </div>
                    )}

                    <div className='cfd-dashboard__accounts-display'>
                        {is_loading ? (
                            <LoadingCFDAccountDisplay />
                        ) : (
                            <>
                                <CFDPasswordManagerModal
                                    is_visible={password_manager.is_visible}
                                    platform={platform}
                                    selected_login={password_manager.selected_login}
                                    selected_account={password_manager.selected_account}
                                    selected_account_group={password_manager.selected_account_group}
                                    selected_account_type={password_manager.selected_account_type}
                                    selected_server={password_manager.selected_server}
                                    toggleModal={togglePasswordManagerModal}
                                />

                                <Tabs
                                    active_index={active_index}
                                    center
                                    is_logged_in={is_logged_in}
                                    onTabItemClick={updateActiveIndex}
                                    should_update_hash
                                    top
                                >
                                    {is_real_enabled && (
                                        <div label={localize('Real account')} hash='real'>
                                            {should_show_missing_real_account && (
                                                <CFDMissingRealAccount
                                                    onClickSignup={beginRealSignupForMt5}
                                                    platform={platform}
                                                />
                                            )}
                                            <CFDAccountDisplay type='real' />
                                        </div>
                                    )}

                                    {is_demo_enabled && (
                                        <div label={localize('Demo account')} hash='demo'>
                                            <CFDAccountDisplay type='demo' />
                                        </div>
                                    )}
                                </Tabs>

                                <CFDAccountInfoModal platform={platform} />

                                <div className='cfd-dashboard__maintenance'>
                                    <Icon
                                        icon='IcAlertWarning'
                                        size={isMobile() ? 28 : 16}
                                        className='cfd-dashboard__maintenance-icon'
                                    />
                                    <div className='cfd-dashboard__maintenance-text'>
                                        {platform === CFD_PLATFORMS.DXTRADE && (
                                            <Localize i18n_default_text='Server maintenance starts at 06:00 GMT every Sunday and may last up to 2 hours. Service may be disrupted during this time.' />
                                        )}
                                        {platform === CFD_PLATFORMS.MT5 && (
                                            <Localize i18n_default_text='Server maintenance starting 01:00 GMT every Sunday. This process may take up to 2 hours to complete. Service may be disrupted during this time.' />
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            ) : (
                <PageError
                    buttonSize={'medium'}
                    header={
                        <Localize
                            i18n_default_text='{{platform_name_mt5}} is not available in {{country}}'
                            values={{
                                country: account_settings.residence,
                                platform_name_mt5: getPlatformSettings('mt5').name,
                            }}
                            components={[<br key={0} />]}
                        />
                    }
                    messages={[<Localize key={0} i18n_default_text='Please explore our other platforms.' />]}
                    redirect_urls={[routes.trade, routes.bot]}
                    redirect_labels={[
                        <Localize
                            key={0}
                            i18n_default_text='Explore {{platform_name_trader}}'
                            values={{ platform_name_trader: getPlatformSettings('trader').name }}
                        />,
                        <Localize
                            key={1}
                            i18n_default_text='Explore {{platform_name_dbot}}'
                            values={{ platform_name_dbot: getPlatformSettings('dbot').name }}
                        />,
                    ]}
                />
            )}
        </>
    );
};

export default withRouter(
    connect(({ client, modules, ui }: RootStore) => ({
        account_settings: client.account_settings,
        beginRealSignupForMt5: modules.cfd.beginRealSignupForMt5,
        dxtrade_accounts_list_error: client.dxtrade_accounts_list_error,
        dxtrade_disabled_signup_types: client.dxtrade_disabled_signup_types,
        has_dxtrade_demo_account_error: client.has_account_error_in_dxtrade_demo_list,
        has_dxtrade_real_account_error: client.has_account_error_in_dxtrade_real_list,
        has_mt5_demo_account_error: client.has_account_error_in_mt5_demo_list,
        has_mt5_real_account_error: client.has_account_error_in_mt5_real_list,
        has_real_account: client.has_active_real_account,
        is_loading: client.is_populating_mt5_account_list,
        is_eu: client.is_eu,
        is_logged_in: client.is_logged_in,
        is_mt5_allowed: client.is_mt5_allowed,
        mt5_disabled_signup_types: client.mt5_disabled_signup_types,
        mt5_status_server: client.website_status.mt5_status,
        NotificationMessages: ui.notification_messages_ui,
        onMount: modules.cfd.onMount,
        onUnmount: modules.cfd.onUnmount,
        upgradeable_landing_companies: client.upgradeable_landing_companies,
    }))(CFDDashboard)
);
