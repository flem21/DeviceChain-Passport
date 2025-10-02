'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { transferOwnership } from '@/lib/actions';
import { ArrowRightLeft, Wallet } from 'lucide-react';
import { useWeb3 } from '@/context/web3-provider';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useActionState } from 'react';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function TransferPage({ params }: { params: { id: string } }) {
  const { account, connectWallet } = useWeb3();
  const initialState = { error: '' };
  const [state, dispatch] = useActionState(transferOwnership, initialState);
  const { toast } = useToast();

   useEffect(() => {
    if (state?.error) {
      toast({
        variant: "destructive",
        title: "Transfer Failed",
        description: state.error,
      })
    }
  }, [state, toast]);

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
            action is irreversible.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={dispatch} className="space-y-6">
            <input type="hidden" name="deviceId" value={params.id} />
            <input type="hidden" name="currentOwner" value={account || ''} />
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
              />
            </div>
            <Button type="submit" className="w-full" variant="default" disabled={!account}>
              Initiate Transfer
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
