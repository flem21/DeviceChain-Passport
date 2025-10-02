'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { logRepair } from '@/lib/contract';
import { Loader2, Wrench } from 'lucide-react';
import { useWeb3 } from '@/context/web3-provider';
import { useToast } from '@/hooks/use-toast';
import { getContract } from '@/lib/contract';

export default function RepairPage({ params }: { params: { id: string } }) {
  const { web3, account } = useWeb3();
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!web3 || !account) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please connect your wallet.' });
      return;
    }

    setIsLoading(true);
    const formData = new FormData(event.currentTarget);
    const serviceProvider = formData.get('serviceProvider') as string;
    const description = formData.get('description') as string;
    const replacedParts = (formData.get('replacedParts') as string).split(',').map(p => p.trim()).filter(Boolean);

    try {
      const contract = getContract(web3);
      await logRepair(contract, account, { deviceId: params.id, serviceProvider, description, replacedParts });
      
      toast({
        title: 'Transaction Submitted',
        description: 'Repair log has been sent to the blockchain.',
      });

      router.push(`/devices/${params.id}`);

    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Action Failed',
        description: error.message || 'An unknown error occurred.',
      });
    } finally {
      setIsLoading(false);
    }
  }


  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="text-primary" />
            Log Repair or Maintenance
          </CardTitle>
          <CardDescription>
            Add a new entry to the device's service history. This action is
            permanently recorded on the blockchain.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="serviceProvider">Service Provider</Label>
              <Input
                id="serviceProvider"
                name="serviceProvider"
                placeholder="e.g., Authorized Repair Center"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description of Service</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe the work performed, e.g., 'Screen replacement', 'Battery diagnostics'."
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="replacedParts">Replaced Parts (comma-separated)</Label>
              <Input
                id="replacedParts"
                name="replacedParts"
                placeholder="e.g., OLED Display, 5000mAh Battery"
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" variant="default" disabled={!account || isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Submitting...' : 'Add to History'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
