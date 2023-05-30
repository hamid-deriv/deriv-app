import React from 'react';
import { Text, useOnClickOutside, Modal, Button } from '@deriv/components';
import { localize } from '@deriv/translations';
import { useStore, observer } from '@deriv/stores';
import './wallets-migration-failed.scss';

const WalletsMigrationFailed = observer(() => {
    const { traders_hub, ui } = useStore();
    const { is_wallet_migration_failed, setWalletsMigrationFailedPopup } = traders_hub;
    const { is_mobile } = ui;

    const mobile_add_class = is_mobile ? '--mobile' : '';

    const wallets_migration_failed_ref = React.useRef<HTMLDivElement>(null);

    const handleClose = () => {
        setWalletsMigrationFailedPopup(false);
    };

    const handLiveChatButtonClick = () => {
        window.LC_API?.open_chat_window();
        setWalletsMigrationFailedPopup(false);
    };

    const validateClickOutside = (e: MouseEvent) => {
        return is_wallet_migration_failed && !wallets_migration_failed_ref?.current?.contains(e.target as Node);
    };

    useOnClickOutside(wallets_migration_failed_ref, handleClose, validateClickOutside);

    return (
        <Modal
            is_open={is_wallet_migration_failed}
            toggleModal={handleClose}
            width={is_mobile ? '32.3rem' : '44rem'}
            should_header_stick_body={false}
            has_close_icon={false}
        >
            <div ref={wallets_migration_failed_ref}>
                <Modal.Body className={`wallets-migration-failed${mobile_add_class}`}>
                    <Text
                        as='h1'
                        size={is_mobile ? 'xs' : 's'}
                        color='prominent'
                        weight='bold'
                        className={`wallets-migration-failed__title${mobile_add_class}`}
                    >
                        {localize('Sorry for the interruption')}
                    </Text>
                    <Text size={is_mobile ? 'xxs' : 'xs'}>
                        {localize(
                            "We're unable to complete with the Wallet upgrade. Please try again later or contact us via live chat."
                        )}
                    </Text>
                </Modal.Body>
                <Modal.Footer className={`wallets-migration-failed__footer${mobile_add_class}`}>
                    <Button secondary large onClick={handLiveChatButtonClick}>
                        {localize('Go to live chat')}
                    </Button>
                    <Button
                        primary
                        large
                        onClick={handleClose}
                        classNameSpan={`wallets-migration-failed__text${mobile_add_class}`}
                    >
                        {localize('Back to Trader’s Hub')}
                    </Button>
                </Modal.Footer>
            </div>
        </Modal>
    );
});

export default WalletsMigrationFailed;
