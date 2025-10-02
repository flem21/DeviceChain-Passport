import type { Device, LifecycleEvent } from './definitions';

let devices: Device[] = [
  {
    id: 'SN-A1B2C3D4E5',
    manufacturer: 'Pixelate Inc.',
    model: 'Quantum 5',
    manufacturingDate: '2023-01-15',
    owner: '0xOwner',
    status: 'active',
    imageUrl: 'https://picsum.photos/seed/smartphone/600/400',
    imageHint: 'smartphone',
  },
  {
    id: 'SN-X9Y8Z7W6V5',
    manufacturer: 'ConnectaCorp',
    model: 'NexusBook Pro',
    manufacturingDate: '2022-11-20',
    owner: '0xAnotherUser',
    status: 'active',
    imageUrl: 'https://picsum.photos/seed/laptop/600/400',
    imageHint: 'laptop',
  },
  {
    id: 'SN-R4S5T6U7V8',
    manufacturer: 'Pixelate Inc.',
    model: 'Quantum Pad',
    manufacturingDate: '2023-03-10',
    owner: '0xOwner',
    status: 'recycled',
    imageUrl: 'https://picsum.photos/seed/tablet/600/400',
    imageHint: 'tablet device',
  },
];

let lifecycleEvents: LifecycleEvent[] = [
  // Device 1 Lifecycle
  {
    id: 'evt-1',
    deviceId: 'SN-A1B2C3D4E5',
    type: 'creation',
    timestamp: '2023-01-15T10:00:00Z',
    details: {
      manufacturer: 'Pixelate Inc.',
      model: 'Quantum 5',
      manufacturingDate: '2023-01-15',
    },
  },
  {
    id: 'evt-2',
    deviceId: 'SN-A1B2C3D4E5',
    type: 'transfer',
    timestamp: '2023-01-20T14:30:00Z',
    details: {
      from: 'Pixelate Inc.',
      to: '0xFirstBuyer',
    },
  },
  {
    id: 'evt-3',
    deviceId: 'SN-A1B2C3D4E5',
    type: 'transfer',
    timestamp: '2023-06-05T18:00:00Z',
    details: {
      from: '0xFirstBuyer',
      to: '0xOwner',
    },
  },
  {
    id: 'evt-4',
    deviceId: 'SN-A1B2C3D4E5',
    type: 'repair',
    timestamp: '2024-02-10T09:15:00Z',
    details: {
      serviceProvider: 'GadgetSavers',
      description: 'Screen replacement due to drop damage.',
      replacedParts: ['OLED Display Panel'],
    },
  },

  // Device 2 Lifecycle
  {
    id: 'evt-5',
    deviceId: 'SN-X9Y8Z7W6V5',
    type: 'creation',
    timestamp: '2022-11-20T08:00:00Z',
    details: {
      manufacturer: 'ConnectaCorp',
      model: 'NexusBook Pro',
      manufacturingDate: '2022-11-20',
    },
  },
  {
    id: 'evt-6',
    deviceId: 'SN-X9Y8Z7W6V5',
    type: 'transfer',
    timestamp: '2022-12-01T11:00:00Z',
    details: {
      from: 'ConnectaCorp',
      to: '0xAnotherUser',
    },
  },

  // Device 3 Lifecycle
  {
    id: 'evt-7',
    deviceId: 'SN-R4S5T6U7V8',
    type: 'creation',
    timestamp: '2023-03-10T12:00:00Z',
    details: {
      manufacturer: 'Pixelate Inc.',
      model: 'Quantum Pad',
      manufacturingDate: '2023-03-10',
    },
  },
  {
    id: 'evt-8',
    deviceId: 'SN-R4S5T6U7V8',
    type: 'transfer',
    timestamp: '2023-03-15T16:45:00Z',
    details: {
      from: 'Pixelate Inc.',
      to: '0xOwner',
    },
  },
  {
    id: 'evt-9',
    deviceId: 'SN-R4S5T6U7V8',
    type: 'recycling',
    timestamp: '2024-05-20T13:00:00Z',
    details: {
      recycledBy: 'EcoTech Recycling',
      notes: 'Device disposed of at an authorized recycling center.',
    },
  },
];


// --- Data Access Functions ---
// NOTE: These are in-memory and will reset on server restart.

export async function getDevices(): Promise<Device[]> {
  return devices;
}

export async function getDeviceById(id: string): Promise<Device | undefined> {
  return devices.find((device) => device.id === id);
}

export async function getDevicesByOwner(owner: string): Promise<Device[]> {
  return devices.filter((device) => device.owner === owner);
}

export async function getDeviceLifecycle(deviceId: string): Promise<LifecycleEvent[]> {
  return lifecycleEvents
    .filter((event) => event.deviceId === deviceId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export async function addDevice(device: Device) {
  devices.push(device);
  return device;
}

export async function addLifecycleEvent(event: LifecycleEvent) {
  lifecycleEvents.push(event);
  return event;
}

export async function updateDevice(id: string, updates: Partial<Device>) {
  devices = devices.map(d => d.id === id ? { ...d, ...updates } : d);
  return devices.find(d => d.id === id);
}
