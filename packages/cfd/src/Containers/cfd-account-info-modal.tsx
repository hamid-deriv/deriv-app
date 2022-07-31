import React from 'react';
import { CFD_PLATFORMS } from '@deriv/shared';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/index';
import { localize } from '@deriv/translations';
import { Button, Modal, MobileDialog, DesktopWrapper, MobileWrapper } from '@deriv/components';
import CFDAccountInfoContent from './cfd-account-info-content';

type TCFDAccountInfoModalProps = {
    is_accounts_info_visible: boolean;
    is_loading: boolean;
    platform: string;
    toggleCompareAccounts: () => void;
};

const CFDAccountInfoModal = ({
    is_accounts_info_visible,
    is_loading,
    platform,
    toggleCompareAccounts,
}: TCFDAccountInfoModalProps) => {
    const cfd_account_label = localize('Account Information');

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

                <React.Suspense>
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
                            <CFDAccountInfoContent />
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
    is_loading: client.is_populating_mt5_account_list,
    toggleCompareAccounts: modules.cfd.toggleCompareAccountsModal,
}))(CFDAccountInfoModal);
