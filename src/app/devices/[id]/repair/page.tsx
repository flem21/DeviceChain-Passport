import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { logRepair } from '@/lib/actions';
import { Wrench } from 'lucide-react';

export default function RepairPage({ params }: { params: { id: string } }) {
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
            permanently recorded.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={logRepair} className="space-y-6">
            <input type="hidden" name="deviceId" value={params.id} />
            <div className="space-y-2">
              <Label htmlFor="serviceProvider">Service Provider</Label>
              <Input
                id="serviceProvider"
                name="serviceProvider"
                placeholder="e.g., Authorized Repair Center"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description of Service</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe the work performed, e.g., 'Screen replacement', 'Battery diagnostics'."
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="replacedParts">Replaced Parts (comma-separated)</Label>
              <Input
                id="replacedParts"
                name="replacedParts"
                placeholder="e.g., OLED Display, 5000mAh Battery"
              />
            </div>
            <Button type="submit" className="w-full" variant="default">
              Add to History
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
