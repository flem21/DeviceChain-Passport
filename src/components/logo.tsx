import { Fingerprint } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        'flex items-center gap-2 text-xl font-bold text-primary',
        className
      )}
    >
      <Fingerprint className="h-6 w-6" />
      <span>DeviceChain</span>
    </Link>
  );
}
