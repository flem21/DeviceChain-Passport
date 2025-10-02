'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SearchX } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function DeviceNotFound() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  return (
    <div className="flex items-center justify-center h-full">
        <Card className="max-w-lg w-full text-center p-8 animate-fade-in-up">
            <CardHeader>
                <div className="mx-auto bg-destructive/10 rounded-full p-4 w-fit">
                    <SearchX className="w-12 h-12 text-destructive" />
                </div>
                <CardTitle className="mt-4 text-2xl">Device Not Found</CardTitle>
                <CardDescription>
                    The device with serial number
                    <span className="font-bold font-mono text-foreground break-all mx-1">
                        {id || 'N/A'}
                    </span>
                     could not be found on the blockchain.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                    Please check the serial number and try again. The device may not be registered yet.
                </p>
                <Button asChild>
                    <Link href="/">Return to Search</Link>
                </Button>
            </CardContent>
        </Card>
    </div>
  );
}
