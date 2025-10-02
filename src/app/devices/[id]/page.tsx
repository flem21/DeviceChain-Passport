import Timeline from '@/components/timeline';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getDeviceById, getDeviceLifecycle } from '@/lib/data';
import { MOCK_USER_WALLET } from '@/lib/definitions';
import { Badge } from '@/components/ui/badge';
import { ArrowRightLeft, CheckCircle, Info, KeyRound, Recycle, Wrench, XCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function DevicePassportPage({ params }: { params: { id: string } }) {
  const device = await getDeviceById(params.id);
  const lifecycle = await getDeviceLifecycle(params.id);

  if (!device) {
    notFound();
  }

  const isOwner = device.owner === MOCK_USER_WALLET;
  const isRecycled = device.status === 'recycled';

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Device Info & Image */}
        <div className="lg:col-span-1 space-y-6">
           <Card className="overflow-hidden shadow-lg">
                <div className="relative w-full h-64">
                    <Image src={device.imageUrl} alt={device.model} layout="fill" objectFit="cover" data-ai-hint={device.imageHint} />
                </div>
                <CardHeader>
                    <CardTitle>{device.model}</CardTitle>
                    <CardDescription>{device.manufacturer}</CardDescription>
                </CardHeader>
           </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Info className="text-primary"/>Device Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Serial #</span>
                <span className="font-mono">{device.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Manufactured</span>
                <span className="font-medium">{new Date(device.manufacturingDate).toLocaleDateString()}</span>
              </div>
              <Separator />
               <div className="flex justify-between items-center">
                <span className="text-muted-foreground flex items-center gap-2"><KeyRound className="h-4 w-4"/>Current Owner</span>
                <span className="font-mono text-xs truncate max-w-[150px]">{device.owner}</span>
              </div>
               <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Status</span>
                <Badge variant={isRecycled ? 'destructive' : 'default'} className={`capitalize ${isRecycled ? 'bg-red-500' : 'bg-green-500'} text-white`}>
                    {device.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
          
          {isOwner && !isRecycled && (
             <Card className="shadow-lg">
                <CardHeader><CardTitle>Owner Actions</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <Button asChild variant="outline"><Link href={`/devices/${device.id}/transfer`}><ArrowRightLeft className="mr-2 h-4 w-4"/>Transfer</Link></Button>
                    <Button asChild variant="outline"><Link href={`/devices/${device.id}/repair`}><Wrench className="mr-2 h-4 w-4"/>Log Repair</Link></Button>
                    <form action={`/devices/${device.id}/recycling`} method="GET" className="sm:col-span-2">
                         <Button variant="destructive" className="w-full" type="submit">
                            <Recycle className="mr-2 h-4 w-4"/>Mark as Recycled
                         </Button>
                    </form>
                </CardContent>
             </Card>
          )}

        </div>

        {/* Right Column: Lifecycle Timeline */}
        <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold tracking-tight mb-6">Device Lifecycle</h2>
            <Timeline events={lifecycle} />
        </div>
      </div>
    </div>
  );
}
