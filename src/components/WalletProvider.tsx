import { useMemo } from 'react';
import type { FC, ReactNode } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
    PhantomWalletAdapter,
    SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets';
// import { SolanaMobileWalletAdapter } from '@solana-mobile/wallet-adapter-mobile';
import { NETWORK_CONFIG } from '../config/solana';

interface WalletContextProviderProps {
    children: ReactNode;
}

export const WalletContextProvider: FC<WalletContextProviderProps> = ({ children }) => {
    // Use devnet for development with Helius RPC
    const network = WalletAdapterNetwork.Devnet;

    // Use our secure Helius RPC endpoint
    const endpoint = useMemo(() => NETWORK_CONFIG.rpcUrl, []);

    const wallets = useMemo(
        () => [
            // Mobile Wallet Adapter commented out until we can debug the issue
            // new SolanaMobileWalletAdapter({
            //     appIdentity: {
            //         name: 'Tank Bank',
            //         uri: 'https://tankbank.sol',
            //         icon: 'https://tankbank.sol/favicon.ico',
            //     },
            //     authorizationResultCache: undefined,
            // }),
            new PhantomWalletAdapter({
                network,
            }),
            new SolflareWalletAdapter({ network }),
        ],
        [network]
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    {children}
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};