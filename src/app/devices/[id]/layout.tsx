import { getDeviceById } from "@/lib/data";
import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function DeviceLayout({
    children,
    params,
}: {
    children: React.ReactNode,
    params: { id: string }
}) {
    const device = await getDeviceById(params.id);
    if (!device) {
        notFound();
    }

    return (
        <div className="space-y-6 animate-fade-in-up">
            <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Link href="/" className="hover:text-primary flex items-center gap-1"><Home className="h-4 w-4"/> Home</Link>
                <ChevronRight className="h-4 w-4" />
                <Link href="/dashboard" className="hover:text-primary">Devices</Link>
                <ChevronRight className="h-4 w-4" />
                <span className="font-medium text-foreground">{device.model} ({device.id})</span>
            </nav>
            {children}
        </div>
    );
}
