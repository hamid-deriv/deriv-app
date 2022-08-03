import React from 'react';
import { CFD_PLATFORMS } from '@deriv/shared';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/index';
import { localize } from '@deriv/translations';
import { LandingCompany } from '@deriv/api-types';
import { Button, Modal, MobileDialog, DesktopWrapper, MobileWrapper, UILoader } from '@deriv/components';
import CFDAccountInfoModalContent from './cfd-account-info-modal-content';

type TCFDAccountInfoModalProps = {
    is_accounts_info_visible: boolean;
    is_eu_country: boolean;
    is_eu: boolean;
    is_loading: boolean;
    is_logged_in: boolean;
    is_uk: boolean;
    landing_companies: LandingCompany;
    platform: string;
    residence: string;
    toggleCompareAccounts: () => void;
};

const CFDAccountInfoModal = ({
    is_accounts_info_visible,
    is_eu_country,
    is_eu,
    is_loading,
    is_logged_in,
    is_uk,
    landing_companies,
    platform,
    residence,
    toggleCompareAccounts,
}: TCFDAccountInfoModalProps) => {
    const cfd_account_label = localize('Account Information');
    const show_eu_related = (is_logged_in && is_eu) || (!is_logged_in && is_eu_country);

    return (
        <>
            <div
                className='cfd-compare-accounts-modal__wrapper'
                style={{ marginTop: platform === CFD_PLATFORMS.DXTRADE ? '5rem' : '2.4rem' }}
            >
                <Button
                    className='cfd-dashboard__welcome-message--button'
                    has_effect
                    text={cfd_account_label}
                    onClick={toggleCompareAccounts}
                    secondary
                    disabled={is_loading}
                />

                <React.Suspense fallback={<UILoader />}>
                    <DesktopWrapper>
                        <Modal
                            // TODO: change the class name
                            className='cfd-dashboard__compare-accounts'
                            is_open={is_accounts_info_visible}
                            title={cfd_account_label}
                            toggleModal={toggleCompareAccounts}
                            type='button'
                            height='696px'
                            width='903px'
                        >
                            <CFDAccountInfoModalContent
                                is_logged_in={is_logged_in}
                                landing_companies={landing_companies}
                                platform={platform}
                                show_eu_related={show_eu_related}
                                residence={residence}
                                is_eu={is_eu}
                                is_uk={is_uk}
                            />
                        </Modal>
                    </DesktopWrapper>

                    <MobileWrapper>
                        <MobileDialog
                            portal_element_id='deriv_app'
                            title={cfd_account_label}
                            // TODO: change the class name
                            wrapper_classname='cfd-dashboard__compare-accounts'
                            visible={is_accounts_info_visible}
                            onClose={toggleCompareAccounts}
                        >
                            MobileDialog Content
                        </MobileDialog>
                    </MobileWrapper>
                </React.Suspense>
            </div>
        </>
    );
};

export default connect(({ modules, client }: RootStore) => ({
    is_accounts_info_visible: modules.cfd.is_compare_accounts_visible,
    is_eu_country: client.is_eu_country,
    is_eu: client.is_eu,
    is_loading: client.is_populating_mt5_account_list,
    is_logged_in: client.is_logged_in,
    is_uk: client.is_uk,
    landing_companies: client.landing_companies,
    residence: client.residence,
    toggleCompareAccounts: modules.cfd.toggleCompareAccountsModal,
}))(CFDAccountInfoModal);
