import React from 'react';
import Logo from './logo';

export default function Footer() {
  return (
    <footer className="border-t">
      <div className="container flex flex-col md:flex-row items-center justify-between py-6 gap-4">
        <Logo />
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} DeviceChain Passport. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
