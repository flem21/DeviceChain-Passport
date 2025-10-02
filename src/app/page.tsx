'use server';

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
import { searchDevice } from '@/lib/actions';
import { ArrowRight, Search, FilePlus, Settings, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default async function Home() {
  return (
    <div className="flex flex-col items-center text-center space-y-12">
      <div className="space-y-4 max-w-3xl animate-fade-in-up">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-primary">
          DeviceChain Passport
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground">
          A transparent, secure, and immutable digital identity for your
          electronic devices. Verify authenticity, track ownership, and view
          service history with confidence.
        </p>
      </div>

      <Card className="w-full max-w-lg shadow-lg animate-fade-in-up animation-delay-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 justify-center">
            <Search className="text-primary" />
            View a Device Passport
          </CardTitle>
          <CardDescription>
            Enter a device's serial number to view its complete history.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={searchDevice} className="space-y-4">
            <div className="space-y-2 text-left">
              <Label htmlFor="serialNumber">Serial Number</Label>
              <Input
                id="serialNumber"
                name="serialNumber"
                placeholder="e.g., SN-A1B2C3D4E5"
                required
              />
            </div>
            <Button type="submit" className="w-full" variant="default">
              View Passport <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <div className="w-full max-w-4xl space-y-8 animate-fade-in-up animation-delay-500">
        <div className="text-center">
          <h2 className="text-3xl font-bold">How It Works</h2>
          <p className="text-muted-foreground">A simple process for a secure device history.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
                <CardHeader className="items-center text-center">
                    <div className="p-3 rounded-full bg-primary/10 text-primary mb-2">
                        <FilePlus className="h-8 w-8" />
                    </div>
                    <CardTitle>1. Register</CardTitle>
                    <CardDescription>Connect your wallet and create an immutable digital passport for your device by recording its manufacturing details.</CardDescription>
                </CardHeader>
            </Card>
             <Card>
                <CardHeader className="items-center text-center">
                    <div className="p-3 rounded-full bg-primary/10 text-primary mb-2">
                        <Settings className="h-8 w-8" />
                    </div>
                    <CardTitle>2. Manage</CardTitle>
                    <CardDescription>As the owner, you can transfer ownership, log repairs, and manage the device's end-of-life by marking it as recycled.</CardDescription>
                </CardHeader>
            </Card>
             <Card>
                <CardHeader className="items-center text-center">
                    <div className="p-3 rounded-full bg-primary/10 text-primary mb-2">
                        <ShieldCheck className="h-8 w-8" />
                    </div>
                    <CardTitle>3. Verify</CardTitle>
                    <CardDescription>Anyone can look up a device's passport by its serial number to verify its authenticity and view its entire lifecycle history.</CardDescription>
                </CardHeader>
            </Card>
        </div>
      </div>


      <div className="w-full max-w-lg animate-fade-in-up animation-delay-700">
         <p className="text-sm text-muted-foreground mb-4">Are you a device owner or manufacturer?</p>
         <Button asChild variant="outline">
            <Link href="/dashboard">
                Manage Your Devices
            </Link>
         </Button>
      </div>
    </div>
  );
}
