'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FilePlus, Loader2, Wallet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useWeb3 } from '@/context/web3-provider';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { getContract, registerDevice } from '@/lib/contract';


export default function RegisterDevicePage() {
  const { web3, account, connectWallet } = useWeb3();
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!web3 || !account) {
      toast({
        variant: 'destructive',
        title: 'Connection Error',
        description: 'Please connect your wallet to register a device.',
      });
      return;
    }
    
    setIsLoading(true);
    const formData = new FormData(event.currentTarget);
    const serialNumber = formData.get('serialNumber') as string;
    const manufacturer = formData.get('manufacturer') as string;
    const model = formData.get('model') as string;
    const manufacturingDate = formData.get('manufacturingDate') as string;

    try {
      const contract = getContract(web3);
      await registerDevice(contract, {
        id: serialNumber,
        manufacturer,
        model,
        manufacturingDate,
        owner: account
      });
      
      toast({
        title: 'Registration Submitted',
        description: 'Transaction sent to the network. The device passport will appear once confirmed.',
      });

      router.push(`/devices/${serialNumber}`);

    } catch (error: any) {
       toast({
        variant: 'destructive',
        title: 'Registration Failed',
        description: error.message || 'An unknown error occurred.',
      });
    } finally {
      setIsLoading(false);
    }
  }


  return (
    <div className="max-w-2xl mx-auto animate-fade-in-up">
       {!account && (
        <Alert className="mb-6">
          <Wallet className="h-4 w-4" />
          <AlertTitle>Wallet Not Connected</AlertTitle>
          <AlertDescription>
            Please connect your wallet to register a new device.
             <Button onClick={connectWallet} variant="link" className="p-0 h-auto ml-1">Connect Wallet</Button>
          </AlertDescription>
        </Alert>
      )}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FilePlus className="text-primary" />
            Register a New Device
          </CardTitle>
          <CardDescription>
            Enter the device's manufacturing details to create its digital
            passport on the blockchain.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="serialNumber">Serial Number</Label>
              <Input
                id="serialNumber"
                name="serialNumber"
                placeholder="Unique device identifier (e.g., IMEI, SN)"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="manufacturer">Manufacturer</Label>
              <Input
                id="manufacturer"
                name="manufacturer"
                placeholder="e.g., Apple, Samsung, Dell"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                name="model"
                placeholder="e.g., iPhone 15 Pro, Galaxy S24 Ultra"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="manufacturingDate">Manufacturing Date</Label>
              <Input id="manufacturingDate" name="manufacturingDate" type="date" required disabled={isLoading} />
            </div>
            <Button type="submit" className="w-full" variant="default" disabled={!account || isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Submitting...' : 'Create Passport'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
