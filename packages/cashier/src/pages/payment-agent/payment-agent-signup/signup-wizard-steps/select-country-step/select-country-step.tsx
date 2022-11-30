import React from 'react';
import { Text, DesktopWrapper } from '@deriv/components';
import { ResidenceList } from '@deriv/api-types';
import { Localize } from '@deriv/translations';
import CountrySelector from '../../country-selector';

type TCountrySelectorProps = {
    dispatch: React.ComponentProps<typeof CountrySelector>['dispatch'];
    selected_country?: ResidenceList[number];
};

const SelectCountryStep = ({ dispatch, selected_country }: TCountrySelectorProps) => {
    return (
        <>
            <DesktopWrapper>
                <Text as='p' size='m' line-height='m' weight='bold'>
                    <Localize i18n_default_text='Country of issue' />
                </Text>
            </DesktopWrapper>
            <Text as='p' size='xs' line-height='m' className='pa-signup-wizard__step-text'>
                <Localize i18n_default_text='First, we’ll need to know the country that your document was issued.' />
            </Text>
            <Text as='p' size='xs' color='less-prominent' line-height='m' className='pa-signup-wizard__step-hint'>
                <Localize i18n_default_text='Note: This helps with determining which documents are to be requested from you.' />
            </Text>
            <CountrySelector
                className='pa-signup-wizard__step-country-dropdown'
                selected_country={selected_country}
                dispatch={dispatch}
            />
        </>
    );
};

export default React.memo(SelectCountryStep);
