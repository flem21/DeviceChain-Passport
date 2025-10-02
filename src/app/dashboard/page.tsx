'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { getDevicesByOwner } from '@/lib/data';
import type { Device } from '@/lib/definitions';
import { Badge } from '@/components/ui/badge';
import { HardDrive, PlusCircle, ArrowRight, Wallet } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useWeb3 } from '@/context/web3-provider';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

function DeviceSkeleton() {
    return (
        <Card className="flex flex-col overflow-hidden">
            <Skeleton className="relative w-full h-48" />
            <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-4 w-full" />
            </CardContent>
            <CardFooter>
                <Skeleton className="h-10 w-full" />
            </CardFooter>
        </Card>
    );
}

export default function DashboardPage() {
  const { account, connectWallet } = useWeb3();
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDevices() {
      if (account) {
        setIsLoading(true);
        const userDevices = await getDevicesByOwner(account);
        setDevices(userDevices);
        setIsLoading(false);
      } else {
        setDevices([]);
        setIsLoading(false);
      }
    }
    fetchDevices();
  }, [account]);

  if (!account) {
    return (
        <Card className="flex flex-col items-center justify-center p-12 text-center animate-fade-in-up">
            <Wallet className="w-16 h-16 text-muted-foreground mb-4"/>
            <h2 className="text-xl font-semibold">Connect your wallet</h2>
            <p className="text-muted-foreground mb-6">Please connect your wallet to view your devices.</p>
            <Button onClick={connectWallet}>
                <Wallet className="mr-2 h-4 w-4" />
                Connect Wallet
            </Button>
        </Card>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Devices</h1>
          <p className="text-muted-foreground">Manage your registered devices here.</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/register">
            <PlusCircle className="mr-2 h-4 w-4" />
            Register New Device
          </Link>
        </Button>
      </div>

      {isLoading ? (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DeviceSkeleton />
            <DeviceSkeleton />
            <DeviceSkeleton />
         </div>
      ) : devices.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center">
            <HardDrive className="w-16 h-16 text-muted-foreground mb-4"/>
            <h2 className="text-xl font-semibold">No devices registered yet.</h2>
            <p className="text-muted-foreground mb-6">Get started by registering your first device.</p>
            <Button asChild>
              <Link href="/dashboard/register">Register New Device</Link>
            </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {devices.map((device) => (
            <Card key={device.id} className="flex flex-col overflow-hidden shadow-md hover:shadow-xl transition-shadow">
              <div className="relative w-full h-48">
                 <Image src={device.imageUrl} alt={device.model} layout="fill" objectFit="cover" data-ai-hint={device.imageHint} />
              </div>
              <CardHeader>
                <CardTitle className="flex justify-between items-start">
                  <span>{device.model}</span>
                  <Badge variant={device.status === 'active' ? 'default' : 'destructive'} className="capitalize bg-green-500 text-white data-[state=recycled]:bg-red-500">
                    {device.status}
                  </Badge>
                </CardTitle>
                <CardDescription>{device.manufacturer}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground font-mono break-all">{device.id}</p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={`/devices/${device.id}`}>
                    View Passport <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
