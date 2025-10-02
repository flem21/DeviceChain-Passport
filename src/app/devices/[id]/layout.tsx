'use client';
import { getDeviceById } from "@/lib/data";
import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { useWeb3 } from "@/context/web3-provider";
import { useEffect, useState } from "react";
import { getContract } from "@/lib/contract";
import type { Device } from "@/lib/definitions";

export default function DeviceLayout({
    children,
    params,
}: {
    children: React.ReactNode,
    params: { id: string }
}) {
    const { web3 } = useWeb3();
    const [device, setDevice] = useState<Device | null>(null);

    useEffect(() => {
        async function fetchDevice() {
            if (web3) {
                const contract = getContract(web3);
                try {
                    const deviceData = await getDeviceById(contract, params.id);
                    // The contract might return empty fields for a non-existent device
                    if (deviceData && deviceData.id) {
                        setDevice(deviceData);
                    } else {
                        setDevice(null);
                    }
                } catch (error) {
                    console.error("Failed to fetch device", error);
                    setDevice(null);
                }
            }
        }
        fetchDevice();
    }, [web3, params.id]);


    return (
        <div className="space-y-6 animate-fade-in-up">
            <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Link href="/" className="hover:text-primary flex items-center gap-1"><Home className="h-4 w-4"/> Home</Link>
                <ChevronRight className="h-4 w-4" />
                <Link href="/dashboard" className="hover:text-primary">Devices</Link>
                <ChevronRight className="h-4 w-4" />
                {device ? (
                    <span className="font-medium text-foreground">{device.model} ({device.id})</span>
                ) : (
                    <span className="font-medium text-foreground">Loading...</span>
                )}
            </nav>
            {children}
        </div>
    );
}
