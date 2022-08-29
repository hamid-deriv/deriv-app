import React from 'react';
import classnames from 'classnames';
import { QRCodeSVG } from 'qrcode.react';
import { Icon, Text, DesktopWrapper } from '@deriv/components';
import { CFD_PLATFORMS, isDesktop, isMobile } from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';
import {
    getDXTradeWebTerminalLink,
    getPlatformDXTradeDownloadLink,
    getPlatformMt5DownloadLink,
} from '../Helpers/constants';
import { general_messages } from '../Constants/cfd-shared-strings';
import { TCFDDashboardContainer } from './props.types';

const DxtradeDesktopDownload = ({ active_index, dxtrade_tokens }: Partial<TCFDDashboardContainer>) => {
    return (
        <>
            <h1 className='cfd-dashboard__download-container__heading'>{localize('Run Deriv X on your browser')}</h1>
            <a
                className='cfd-dashboard__download-container__dxtrade-button'
                href={getDXTradeWebTerminalLink(
                    active_index === 0 ? 'real' : 'demo',
                    dxtrade_tokens && dxtrade_tokens[active_index === 0 ? 'real' : 'demo']
                )}
                target='_blank'
                rel='noopener noreferrer'
            >
                <Icon
                    className='cfd-dashboard__download-container__dxtrade-button--icon'
                    icon='IcBrandDxtrade'
                    width={32}
                    height={32}
                />
                <div className='cfd-dashboard__download-container__dxtrade-button-text'>
                    <Text
                        className='cfd-dashboard__download-container__dxtrade-button--title'
                        color='colored-background'
                        size='xxs'
                        weight='bold'
                    >
                        <Localize i18n_default_text='Web terminal' />
                    </Text>
                </div>
            </a>
        </>
    );
};

const MT5DesktopDownload = () => {
    return (
        <>
            <div className='cfd-dashboard__download-container__links__icons'>
                <Icon icon='IcMt5DeviceDesktop' width={118} height={85} />
                <Icon icon='IcMt5DeviceLaptop' width={75} height={51} />
            </div>
            <div className='cfd-dashboard__download-container__links__download-buttons'>
                <a href={getPlatformMt5DownloadLink('windows')} target='_blank' rel='noopener noreferrer'>
                    <Icon icon='IcInstallationWindows' width={138} height={40} />
                </a>
                <a href={getPlatformMt5DownloadLink('macos')} target='_blank' rel='noopener noreferrer'>
                    <Icon icon='IcInstallationMacos' width={138} height={40} />
                </a>
                <a href={getPlatformMt5DownloadLink('linux')} target='_blank' rel='noopener noreferrer'>
                    <Icon icon='IcInstallationLinux' width={138} height={40} />
                </a>
            </div>
            <Text as='p' align='center' size='xxxs' className='cfd-dashboard__download-center--hint'>
                <Localize i18n_default_text='The MT5 desktop app is not supported by Windows XP, Windows 2003, and Windows Vista.' />
            </Text>
        </>
    );
};

const MobileDownload = ({ is_dark_mode_on, platform }: Partial<TCFDDashboardContainer>) => {
    return (
        <>
            {platform === CFD_PLATFORMS.DXTRADE && (
                <h1 className='cfd-dashboard__download-container__heading'>
                    {localize('Download the Deriv X mobile app')}
                </h1>
            )}
            <div
                className={classnames({
                    'cfd-dashboard__download-container__links__icons': isMobile() || platform === CFD_PLATFORMS.MT5,
                })}
            >
                {isMobile() && platform === CFD_PLATFORMS.DXTRADE && (
                    <>
                        <Icon
                            icon={is_dark_mode_on ? 'IcDxtradeDeviceTabletLight' : 'IcDxtradeDeviceTablet'}
                            width={133}
                            height={106}
                        />
                        <Icon
                            icon={is_dark_mode_on ? 'IcDxtradeDevicePhoneLight' : 'IcDxtradeDevicePhone'}
                            width={48}
                            height={74}
                        />
                    </>
                )}
                {platform === CFD_PLATFORMS.MT5 && (
                    <>
                        <Icon icon='IcMt5DeviceTablet' width={133} height={106} />
                        <Icon icon='IcMt5DevicePhone' width={48} height={74} />
                    </>
                )}
            </div>
            <div className='cfd-dashboard__download-container__links__download-buttons'>
                <a
                    className='cfd-dashboard__download-center-options--mobile-link'
                    href={
                        platform === CFD_PLATFORMS.MT5
                            ? getPlatformMt5DownloadLink('android')
                            : getPlatformDXTradeDownloadLink('android')
                    }
                    target='_blank'
                    rel='noopener noreferrer'
                >
                    <Icon icon='IcInstallationGoogle' width={135} height={40} />
                </a>
                <a
                    className='cfd-dashboard__download-center-options--mobile-link'
                    href={
                        platform === CFD_PLATFORMS.MT5
                            ? getPlatformMt5DownloadLink('ios')
                            : getPlatformDXTradeDownloadLink('ios')
                    }
                    target='_blank'
                    rel='noopener noreferrer'
                >
                    <Icon icon='IcInstallationApple' width={120} height={40} />
                </a>
                <a
                    className='cfd-dashboard__download-center-options--mobile-link'
                    href={
                        platform === CFD_PLATFORMS.MT5
                            ? getPlatformMt5DownloadLink('huawei')
                            : getPlatformDXTradeDownloadLink('huawei')
                    }
                    target='_blank'
                    rel='noopener noreferrer'
                >
                    <Icon icon='IcInstallationHuawei' width={120} height={40} />
                </a>
            </div>
        </>
    );
};

const QRCode = () => {
    return (
        <DesktopWrapper>
            <div className='cfd-dashboard__download-container__qrcode'>
                <QRCodeSVG value='https://deriv.com/' size={160} />
                <span className='cfd-dashboard__download-container__qrcode__hint'>
                    {localize('Scan the QR code to download the Deriv X Mobile App')}
                </span>
            </div>
        </DesktopWrapper>
    );
};

const CFDDownloadContainer = ({ platform, is_dark_mode_on, active_index, dxtrade_tokens }: TCFDDashboardContainer) => {
    return (
        <div
            className={classnames('cfd-dashboard__download-container', {
                'cfd-dashboard__download-container--is-mt5': platform === CFD_PLATFORMS.MT5,
            })}
            data-testid='dt_cfd_dashboard_download_center_container'
        >
            {platform === CFD_PLATFORMS.MT5 && (
                <h1 className='cfd-dashboard__download-container__heading'>
                    {isDesktop() ? general_messages.getDownloadHeader(platform) : localize('Download the MT5 app')}
                </h1>
            )}
            <div
                className={classnames('cfd-dashboard__download-container__links', {
                    'cfd-dashboard__download-container__links--is-mt5': platform === CFD_PLATFORMS.MT5,
                })}
            >
                <DesktopWrapper>
                    <div className='cfd-dashboard__download-container__links--desktop'>
                        {platform === CFD_PLATFORMS.DXTRADE && (
                            <DxtradeDesktopDownload active_index={active_index} dxtrade_tokens={dxtrade_tokens} />
                        )}
                        {platform === CFD_PLATFORMS.MT5 && <MT5DesktopDownload />}
                    </div>
                </DesktopWrapper>

                <div className='cfd-dashboard__download-container__links--mobile'>
                    <MobileDownload is_dark_mode_on={is_dark_mode_on} platform={platform} />
                </div>
            </div>

            {platform === CFD_PLATFORMS.DXTRADE && <QRCode />}
        </div>
    );
};

export default CFDDownloadContainer;
