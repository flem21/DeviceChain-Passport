import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { getDevicesByOwner } from '@/lib/data';
import { MOCK_USER_WALLET } from '@/lib/definitions';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { HardDrive, PlusCircle, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default async function DashboardPage() {
  const devices = await getDevicesByOwner(MOCK_USER_WALLET);

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

      {devices.length === 0 ? (
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
