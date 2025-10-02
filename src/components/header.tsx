'use client';

import Link from 'next/link';
import Logo from './logo';
import { Button } from './ui/button';
import { HardDrive, Wallet } from 'lucide-react';
import { useWeb3 } from '@/context/web3-provider';
import { Badge } from './ui/badge';

export default function Header() {
  const { account, connectWallet, web3 } = useWeb3();

  const handleConnect = async () => {
    try {
      await connectWallet();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      // You might want to show a toast notification to the user
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Logo />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            {account && (
               <Button asChild variant="ghost">
                <Link href="/dashboard">
                  <HardDrive className="mr-2 h-4 w-4" />
                  My Devices
                </Link>
              </Button>
            )}
            {web3 ? (
              account ? (
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="font-mono text-xs">
                    {`${account.substring(0, 6)}...${account.substring(account.length - 4)}`}
                  </Badge>
                </div>
              ) : (
                <Button onClick={handleConnect} variant="outline">
                  <Wallet className="mr-2 h-4 w-4" />
                  Connect Wallet
                </Button>
              )
            ) : (
              <Button variant="outline" disabled>
                Install MetaMask
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
