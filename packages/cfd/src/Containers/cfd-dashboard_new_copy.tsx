import React from 'react';
import { withRouter } from 'react-router-dom';

// Utils
import { general_messages } from 'Constants/cfd-shared-strings';
import { connect } from 'Stores/connect';

// Types
import RootStore from 'Stores/index';

// Styles
import 'Sass/cfd-dashboard.scss';

// In-page Types
type TCFDDashboard = {
    is_logged_in: boolean;
    platform: 'mt5' | 'dxtrade';
};

// TODO: Remove this after completing the props
// eslint-disable-next-line prettier/prettier
const CFDDashboard = ({ is_logged_in, platform }: TCFDDashboard) => {
    return (
        <>
            <div className='cfd-dashboard'>
                <div className='cfd-dashboard__welcome-message'>
                    <h1 className='cfd-dashboard__welcome-message--heading'>
                        {general_messages.getWelcomeHeader(is_logged_in, platform)}
                    </h1>
                </div>
            </div>
        </>
    );
};

export default withRouter(
    // TODO: Remove this after completing the connect props
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    connect(({ client, modules, ui }: RootStore) => ({
        is_logged_in: client.is_logged_in,
    }))(CFDDashboard)
);
