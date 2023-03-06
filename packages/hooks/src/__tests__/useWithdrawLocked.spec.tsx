import * as React from 'react';
import { StoreProvider, mockStore } from '@deriv/stores';
import type { TStores } from '@deriv/stores';
import { renderHook } from '@testing-library/react-hooks';
import useWithdrawLocked from '../useWithdrawLocked';
import useNeedPOI from '../useNeedPOI';

jest.mock('../useNeedPOI');

describe('useWithdrawLocked', () => {
    test('should be true if useNeedPOI is true', async () => {
        (useNeedPOI as jest.Mock).mockReturnValue(true);
        const mockRootStore = mockStore({});

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mockRootStore as TStores}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useWithdrawLocked(), { wrapper });

        expect(result.current).toBe(true);
    });
    test('should be true if is_withdrawal_lock is true', async () => {
        const mockRootStore = mockStore({
            client: {
                is_withdrawal_lock: true,
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mockRootStore as TStores}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useWithdrawLocked(), { wrapper });

        expect(result.current).toBe(true);
    });
    test('should be false if is_need_poi is false', async () => {
        (useNeedPOI as jest.Mock).mockReturnValue(false);
        const mockRootStore = mockStore({});
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mockRootStore as TStores}>{children}</StoreProvider>
        );
        const { result } = renderHook(() => useWithdrawLocked(), { wrapper });

        expect(result.current).toBe(false);
    });
});
