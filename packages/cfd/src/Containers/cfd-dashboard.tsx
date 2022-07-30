import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

// Utils
import { general_messages } from 'Constants/cfd-shared-strings';
import { connect } from 'Stores/connect';

// Components
import { Text, PageError } from '@deriv/components';
import { CFD_PLATFORMS, getPlatformSettings, routes, isEmptyObject } from '@deriv/shared';
import { Localize } from '@deriv/translations';

// Types
import RootStore from 'Stores/index';
import { GetSettings } from '@deriv/api-types';

// Styles
import 'Sass/cfd-dashboard.scss';

// In-page Types
type TMt5StatusServerType = {
    all: number;
    platform: number;
    server_number: number;
};
type TMt5StatusServer = Record<'demo' | 'real', TMt5StatusServerType[]>;

type TCFDDashboard = RouteComponentProps & {
    account_settings: GetSettings;
    dxtrade_accounts_list_error: null;
    dxtrade_disabled_signup_types: {
        real: boolean;
        demo: boolean;
    };
    has_dxtrade_demo_account_error: boolean;
    has_dxtrade_real_account_error: boolean;
    has_mt5_demo_account_error: boolean;
    has_mt5_real_account_error: boolean;
    mt5_disabled_signup_types: {
        real: boolean;
        demo: boolean;
    };
    is_logged_in: boolean;
    is_mt5_allowed: boolean;
    mt5_status_server: TMt5StatusServer;
    NotificationMessages: ({ ...props }) => JSX.Element;
    platform: 'mt5' | 'dxtrade';
    onMount: () => void;
    onUnmount: () => void;
};

// TODO: Remove this after completing the props
// eslint-disable-next-line prettier/prettier
const CFDDashboard = ({
    account_settings,
    dxtrade_accounts_list_error,
    dxtrade_disabled_signup_types,
    has_dxtrade_demo_account_error,
    has_dxtrade_real_account_error,
    has_mt5_demo_account_error,
    has_mt5_real_account_error,
    is_logged_in,
    is_mt5_allowed,
    mt5_disabled_signup_types,
    mt5_status_server,
    NotificationMessages,
    platform,
    onMount,
    onUnmount,
}: TCFDDashboard) => {
    // States
    const [active_index, setActiveIndex] = React.useState<number>(0);
    const [is_demo_enabled, setIsDemoEnabled] = React.useState<boolean>(false);
    const [is_real_enabled, setIsRealEnabled] = React.useState<boolean>(false);
    const [is_notification_loaded, setIsNotificationLoaded] = React.useState<boolean>(false);

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

    // TODO: continue from here
    // React.useEffect(() => {
    //     // props.checkShouldOpenAccount();

    //     if (is_logged_in) {
    //         ['demo', 'real'].forEach(account_type => {
    //             const should_enable_tab =
    //                 isSyntheticCardVisible(account_type) || isFinancialCardVisible() || isFinancialStpCardVisible();

    //             if (account_type === 'real' && is_real_enabled !== should_enable_tab) {
    //                 setIsRealEnabled(should_enable_tab);
    //             }

    //             if (account_type === 'demo' && is_demo_enabled !== should_enable_tab) {
    //                 setIsDemoEnabled(should_enable_tab);
    //             }
    //         });
    //     }

    //     if (!props.is_logged_in && (!is_real_enabled || !is_demo_enabled)) {
    //         setIsRealEnabled(true);
    //         setIsDemoEnabled(true);
    //     }
    //     if (window.location.hash === '#demo') {
    //         setIsDemoEnabled(true);
    //         setActiveIndex(1);
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);

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
    const updateActiveIndex = (index?: 0 | 1 | undefined) => {
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
    // TODO: Remove this after completing the connect props
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    connect(({ client, modules, ui }: RootStore) => ({
        account_settings: client.account_settings,
        dxtrade_accounts_list_error: client.dxtrade_accounts_list_error,
        dxtrade_disabled_signup_types: client.dxtrade_disabled_signup_types,
        has_dxtrade_demo_account_error: client.has_account_error_in_dxtrade_demo_list,
        has_dxtrade_real_account_error: client.has_account_error_in_dxtrade_real_list,
        has_mt5_demo_account_error: client.has_account_error_in_mt5_demo_list,
        has_mt5_real_account_error: client.has_account_error_in_mt5_real_list,
        is_logged_in: client.is_logged_in,
        is_mt5_allowed: client.is_mt5_allowed,
        mt5_disabled_signup_types: client.mt5_disabled_signup_types,
        mt5_status_server: client.website_status.mt5_status,
        NotificationMessages: ui.notification_messages_ui,
        onMount: modules.cfd.onMount,
        onUnmount: modules.cfd.onUnmount,
    }))(CFDDashboard)
);
