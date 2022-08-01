import breakpoints from '../../styles/responsive.module.scss';

export const MAX_MOBILE_WIDTH = breakpoints.mobileWidth; // iPhone 12 Pro Max has the world largest viewport size of 428 x 926
export const MAX_TABLET_WIDTH = breakpoints.TabletWidth;

export const isTouchDevice = () =>
    'ontouchstart' in window ||
    'ontouchstart' in document.documentElement ||
    (window.DocumentTouch && document instanceof window.DocumentTouch) ||
    navigator.maxTouchPoints > 0 ||
    window.navigator.msMaxTouchPoints > 0;
export const isMobile = () => window.innerWidth <= MAX_MOBILE_WIDTH;
export const isTablet = () => MAX_MOBILE_WIDTH < window.innerWidth && window.innerWidth <= MAX_TABLET_WIDTH;
export const isDesktop = () => isTablet() || window.innerWidth > MAX_TABLET_WIDTH; // TODO: remove tablet once there is a design for the specific size.
