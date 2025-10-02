'use client';
import { useEffect, useState } from 'react';
import Timeline from '@/components/timeline';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getDeviceById, getDeviceLifecycle } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { ArrowRightLeft, KeyRound, Recycle, Wrench } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useWeb3 } from '@/context/web3-provider';
import { Device, LifecycleEvent } from '@/lib/definitions';
import { Info, AlertTriangle } from 'lucide-react';
import { getContract } from '@/lib/contract';
import { Skeleton } from '@/components/ui/skeleton';

function PassportSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
            <Card className="overflow-hidden">
                <Skeleton className="w-full h-64" />
                <CardHeader>
                    <Skeleton className="h-8 w-3/4 mb-2"/>
                    <Skeleton className="h-4 w-1/2"/>
                </CardHeader>
            </Card>
            <Card>
                <CardHeader><Skeleton className="h-6 w-1/2"/></CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-4 w-full"/>
                    <Skeleton className="h-4 w-full"/>
                    <Skeleton className="h-4 w-full"/>
                    <Skeleton className="h-4 w-full"/>
                </CardContent>
            </Card>
        </div>
        <div className="lg:col-span-2">
            <Skeleton className="h-8 w-1/3 mb-6"/>
            <div className="space-y-4">
              <Skeleton className="h-24 w-full"/>
              <Skeleton className="h-24 w-full"/>
              <Skeleton className="h-24 w-full"/>
            </div>
        </div>
    </div>
  )
}


export default function DevicePassportPage({ params }: { params: { id: string } }) {
  const { web3, account } = useWeb3();
  const [device, setDevice] = useState<Device | null>(null);
  const [lifecycle, setLifecycle] = useState<LifecycleEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
        if (!web3) return;
        setIsLoading(true);
        setError(null);
        try {
            const contract = getContract(web3);
            const deviceData = await getDeviceById(contract, params.id);
            
            // The contract might return empty fields for a non-existent device
            if (!deviceData || !deviceData.id || deviceData.id.startsWith('0x000')) {
                setError(`Device with ID "${params.id}" not found on the blockchain.`);
                setDevice(null);
            } else {
                const lifecycleData = await getDeviceLifecycle(contract, params.id);
                setDevice(deviceData);
                setLifecycle(lifecycleData);
            }
        } catch (err: any) {
            console.error("Failed to fetch device data", err);
            setError(err.message || "An error occurred while fetching device data.");
        } finally {
            setIsLoading(false);
        }
    }
    fetchData();
  }, [web3, params.id]);

  if (isLoading) {
    return <PassportSkeleton />;
  }
  
  if (error) {
     return (
        <Card className="max-w-lg w-full text-center p-8 mx-auto">
            <CardHeader>
                <div className="mx-auto bg-destructive/10 rounded-full p-4 w-fit">
                    <AlertTriangle className="w-12 h-12 text-destructive" />
                </div>
                <CardTitle className="mt-4 text-2xl">Error</CardTitle>
                <CardDescription>
                    {error}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Button asChild>
                    <Link href="/">Return to Search</Link>
                </Button>
            </CardContent>
        </Card>
     )
  }

  if (!device) {
    return null; // Should be handled by error state
  }

  const isOwner = account && device.owner.toLowerCase() === account.toLowerCase();
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
                    <Button asChild variant="destructive" className="w-full sm:col-span-2"><Link href={`/devices/${device.id}/recycling`}><Recycle className="mr-2 h-4 w-4"/>Mark as Recycled</Link></Button>
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
