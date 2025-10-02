import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { transferOwnership } from '@/lib/actions';
import { ArrowRightLeft } from 'lucide-react';

export default function TransferPage({ params }: { params: { id: string } }) {
  return (
    <div className="max-w-2xl mx-auto">
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
          <form action={transferOwnership} className="space-y-6">
            <input type="hidden" name="deviceId" value={params.id} />
            <div className="space-y-2">
              <Label htmlFor="currentOwner">Current Device ID</Label>
              <Input
                id="currentOwner"
                value={params.id}
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newOwner">New Owner's Wallet Address</Label>
              <Input
                id="newOwner"
                name="newOwner"
                placeholder="e.g., 0xNewOwner"
                required
              />
            </div>
            <Button type="submit" className="w-full" variant="accent">
              Initiate Transfer
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
