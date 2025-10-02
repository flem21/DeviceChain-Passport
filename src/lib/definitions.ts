export type Device = {
  id: string; // This will be the serial number
  model: string;
  manufacturer: string;
  manufacturingDate: string; // ISO String format
  owner: string; // Wallet address
  status: 'active' | 'recycled';
  imageUrl: string;
  imageHint: string;
};

export type CreationEventDetails = {
  model: string;
  manufacturer: string;
};

export type TransferEventDetails = {
  from: string;
  to: string;
};

export type RepairEventDetails = {
  serviceProvider: string;
  description: string;
  replacedParts: string[];
};

export type RecyclingEventDetails = {
  recycledBy: string;
  notes: string;
};

export type LifecycleEvent = {
  id: string; // A unique ID for the event, e.g., transaction hash
  deviceId: string;
  type: 'creation' | 'transfer' | 'repair' | 'recycling';
  timestamp: string; // ISO String format
  details: CreationEventDetails | TransferEventDetails | RepairEventDetails | RecyclingEventDetails;
};
