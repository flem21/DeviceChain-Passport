'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { markAsRecycled } from '@/lib/contract';
import { Loader2, Recycle } from 'lucide-react';
import { useWeb3 } from '@/context/web3-provider';
import { useToast } from '@/hooks/use-toast';
import { getContract } from '@/lib/contract';

export default function RecyclingPage({ params }: { params: { id: string } }) {
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
    const recycledBy = formData.get('recycledBy') as string;
    const notes = formData.get('notes') as string;
    
    try {
      const contract = getContract(web3);
      await markAsRecycled(contract, account, { deviceId: params.id, recycledBy, notes });
      
      toast({
        title: 'Transaction Submitted',
        description: 'Device recycling has been recorded on the blockchain.',
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
      <Card className="shadow-lg border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Recycle />
            Mark Device as Recycled
          </CardTitle>
          <CardDescription>
            This action marks the end-of-life for the device. The status will be updated to 'recycled', and further transfers will be disabled. This is a permanent record.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="recycledBy">Recycled By</Label>
              <Input
                id="recycledBy"
                name="recycledBy"
                placeholder="e.g., Authorized Recycling Facility"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="e.g., 'Device dropped off at city e-waste center'."
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" variant="destructive" disabled={!account || isLoading}>
               {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
               {isLoading ? 'Submitting...' : 'Confirm End-of-Life'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
