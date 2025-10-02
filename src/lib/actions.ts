'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { addDevice, addLifecycleEvent, getDeviceById, updateDevice } from './data';
import type { CreationEventDetails, Device, LifecycleEvent, RepairEventDetails, TransferEventDetails } from './definitions';
import { MOCK_USER_WALLET } from './definitions';

export async function searchDevice(formData: FormData) {
  const serialNumber = formData.get('serialNumber') as string;
  if (!serialNumber) return;

  const device = await getDeviceById(serialNumber);
  if (device) {
    redirect(`/devices/${serialNumber}`);
  } else {
    redirect(`/devices/not-found?id=${serialNumber}`);
  }
}

export async function registerDevice(formData: FormData) {
  const serialNumber = formData.get('serialNumber') as string;
  const manufacturer = formData.get('manufacturer') as string;
  const model = formData.get('model') as string;
  const manufacturingDate = formData.get('manufacturingDate') as string;

  const existingDevice = await getDeviceById(serialNumber);
  if (existingDevice) {
    return { error: 'Device with this serial number already exists.' };
  }

  const newDevice: Device = {
    id: serialNumber,
    manufacturer,
    model,
    manufacturingDate,
    owner: MOCK_USER_WALLET,
    status: 'active',
    imageUrl: `https://picsum.photos/seed/${serialNumber}/600/400`,
    imageHint: 'device',
  };

  const creationEvent: LifecycleEvent = {
    id: `evt-${Date.now()}`,
    deviceId: serialNumber,
    type: 'creation',
    timestamp: new Date().toISOString(),
    details: {
      manufacturer,
      model,
      manufacturingDate,
    } as CreationEventDetails,
  };

  await addDevice(newDevice);
  await addLifecycleEvent(creationEvent);

  revalidatePath('/dashboard');
  redirect(`/devices/${serialNumber}`);
}

export async function transferOwnership(formData: FormData) {
  const deviceId = formData.get('deviceId') as string;
  const newOwner = formData.get('newOwner') as string;

  const device = await getDeviceById(deviceId);
  if (!device) {
    return { error: 'Device not found.' };
  }
  
  if (device.owner !== MOCK_USER_WALLET) {
    return { error: 'Only the current owner can transfer the device.' };
  }

  const transferEvent: LifecycleEvent = {
    id: `evt-${Date.now()}`,
    deviceId,
    type: 'transfer',
    timestamp: new Date().toISOString(),
    details: {
      from: device.owner,
      to: newOwner,
    } as TransferEventDetails,
  };

  await addLifecycleEvent(transferEvent);
  await updateDevice(deviceId, { owner: newOwner });

  revalidatePath(`/devices/${deviceId}`);
  revalidatePath('/dashboard');
  redirect(`/devices/${deviceId}`);
}

export async function logRepair(formData: FormData) {
    const deviceId = formData.get('deviceId') as string;
    const serviceProvider = formData.get('serviceProvider') as string;
    const description = formData.get('description') as string;
    const replacedParts = (formData.get('replacedParts') as string).split(',').map(p => p.trim()).filter(Boolean);

    const device = await getDeviceById(deviceId);
    if (!device) {
        return { error: 'Device not found.' };
    }
    
    // In a real app, you'd check for authorization here
    // if(device.owner !== MOCK_USER_WALLET) { ... }

    const repairEvent: LifecycleEvent = {
        id: `evt-${Date.now()}`,
        deviceId,
        type: 'repair',
        timestamp: new Date().toISOString(),
        details: {
            serviceProvider,
            description,
            replacedParts,
        } as RepairEventDetails,
    };

    await addLifecycleEvent(repairEvent);

    revalidatePath(`/devices/${deviceId}`);
    redirect(`/devices/${deviceId}`);
}

export async function markAsRecycled(formData: FormData) {
  const deviceId = formData.get('deviceId') as string;
  const recycledBy = formData.get('recycledBy') as string;
  const notes = formData.get('notes') as string;
  
  const device = await getDeviceById(deviceId);
  if (!device) {
    return { error: 'Device not found.' };
  }

  const recyclingEvent: LifecycleEvent = {
    id: `evt-${Date.now()}`,
    deviceId,
    type: 'recycling',
    timestamp: new Date().toISOString(),
    details: { recycledBy, notes },
  };

  await addLifecycleEvent(recyclingEvent);
  await updateDevice(deviceId, { status: 'recycled' });

  revalidatePath(`/devices/${deviceId}`);
  revalidatePath('/dashboard');
  redirect(`/devices/${deviceId}`);
}
