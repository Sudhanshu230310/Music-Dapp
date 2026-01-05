"use client"
import { SessionProvider } from "next-auth/react";
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import {WalletModalProvider,WalletDisconnectButton,WalletMultiButton} from '@solana/wallet-adapter-react-ui';

// Default styles that can be overridden by your app
import '@solana/wallet-adapter-react-ui/styles.css';

export function Provider({children}:{children:React.ReactNode}){
    return <SessionProvider>
        {children}
    </SessionProvider>
}

export function ConProvider({children}:{children:React.ReactNode}){
    const endpoint="https://api.devnet.solana.com"
      return (
          <ConnectionProvider endpoint={endpoint}>
                <WalletProvider wallets={[]} autoConnect>
                    <WalletModalProvider>
                      {children}
                    </WalletModalProvider>
                </WalletProvider>
            </ConnectionProvider>
      );
}