import React from 'react';
import { Modal } from '@deriv/ui';
import { localize } from '@deriv/translations';

type TCancelWizardDialogProps = {
    onConfirm: VoidFunction;
    onCancel: VoidFunction;
    is_visible: boolean;
};

// TODO: These types should be imported from @deriv/ui
type TButtonColor = 'primary' | 'primary-light' | 'secondary' | 'tertiary' | 'monochrome';
export type TModalActionButton = {
    id: number;
    text: string;
    color: TButtonColor;
    onClick: () => void;
};

const CancelWizardDialog = ({ onConfirm, onCancel, is_visible }: TCancelWizardDialogProps) => {
    const actionButtons: TModalActionButton[] = [
        {
            id: 0,
            text: localize('No, take me back'),
            color: 'tertiary',
            onClick: onCancel,
        },
        {
            id: 1,
            text: localize('Yes, cancel'),
            color: 'primary',
            onClick: onConfirm,
        },
    ];

    return (
        <Modal open={is_visible}>
            <Modal.Portal>
                <Modal.Overlay />
                <Modal.DialogContent
                    title={localize('Are you sure you want to cancel?')}
                    content={localize('If you click Cancel, you’ll lose the inputs you’ve made so far.')}
                    action_buttons={actionButtons}
                    has_close_button
                />
            </Modal.Portal>
        </Modal>
    );
};

export default CancelWizardDialog;
