'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { transferOwnership } from '@/lib/contract';
import { ArrowRightLeft, Wallet, Loader2 } from 'lucide-react';
import { useWeb3 } from '@/context/web3-provider';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { getContract } from '@/lib/contract';

export default function TransferPage({ params }: { params: { id: string } }) {
  const { web3, account, connectWallet } = useWeb3();
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!web3 || !account) {
      toast({
        variant: 'destructive',
        title: 'Wallet not connected',
        description: 'Please connect your wallet to transfer ownership.',
      });
      return;
    }
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const newOwner = formData.get('newOwner') as string;

    try {
        const contract = getContract(web3);
        await transferOwnership(contract, {
            deviceId: params.id,
            currentOwner: account,
            newOwner,
        });

        toast({
            title: 'Transfer Initiated',
            description: 'Transaction sent to the network. Ownership will update upon confirmation.',
        });

        router.push(`/devices/${params.id}`);

    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Transfer Failed",
            description: error.message || "An unknown error occurred during the transfer.",
        });
    } finally {
        setIsLoading(false);
    }
  }


  return (
    <div className="max-w-2xl mx-auto">
      {!account && (
        <Alert className="mb-6">
          <Wallet className="h-4 w-4" />
          <AlertTitle>Wallet Not Connected</AlertTitle>
          <AlertDescription>
            Please connect your wallet to transfer device ownership.
             <Button onClick={connectWallet} variant="link" className="p-0 h-auto ml-1">Connect Wallet</Button>
          </AlertDescription>
        </Alert>
      )}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRightLeft className="text-primary" />
            Transfer Device Ownership
          </CardTitle>
          <CardDescription>
            Enter the new owner's wallet address to transfer this device. This
            action is irreversible and will be recorded on the blockchain.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="deviceId">Device Serial Number</Label>
              <Input
                id="deviceId"
                value={params.id}
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newOwner">New Owner's Wallet Address</Label>
              <Input
                id="newOwner"
                name="newOwner"
                placeholder="e.g., 0xNewOwner..."
                required
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" variant="default" disabled={!account || isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Submitting...' : 'Initiate Transfer'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
