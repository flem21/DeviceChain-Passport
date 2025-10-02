import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 text-center h-full">
      <AlertTriangle className="w-24 h-24 text-accent" />
      <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
      <p className="text-lg text-muted-foreground max-w-md">
        The page you are looking for does not exist. It might have been moved or deleted.
      </p>
      <Button asChild>
        <Link href="/">Return to Homepage</Link>
      </Button>
    </div>
  );
}
