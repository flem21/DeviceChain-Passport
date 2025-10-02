import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { markAsRecycled } from '@/lib/actions';
import { Recycle } from 'lucide-react';

export default function RecyclingPage({ params }: { params: { id: string } }) {
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
          <form action={markAsRecycled} className="space-y-6">
            <input type="hidden" name="deviceId" value={params.id} />
            <div className="space-y-2">
              <Label htmlFor="recycledBy">Recycled By</Label>
              <Input
                id="recycledBy"
                name="recycledBy"
                placeholder="e.g., Authorized Recycling Facility"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="e.g., 'Device dropped off at city e-waste center'."
              />
            </div>
            <Button type="submit" className="w-full" variant="destructive">
              Confirm End-of-Life
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
