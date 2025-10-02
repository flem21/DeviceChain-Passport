import Link from 'next/link';
import Logo from './logo';
import { Button } from './ui/button';
import { HardDrive } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Logo />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <Button asChild variant="ghost">
              <Link href="/dashboard">
                <HardDrive className="mr-2 h-4 w-4" />
                My Devices
              </Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
