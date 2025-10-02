export type Device = {
  id: string; // This will be the serial number
  model: string;
  manufacturer: string;
  manufacturingDate: string;
  owner: string;
  status: 'active' | 'recycled';
  imageUrl: string;
  imageHint: string;
};

export type CreationEventDetails = {
  model: string;
  manufacturer: string;
  manufacturingDate: string;
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
  id: string;
  deviceId: string;
  type: 'creation' | 'transfer' | 'repair' | 'recycling';
  timestamp: string;
  details: CreationEventDetails | TransferEventDetails | RepairEventDetails | RecyclingEventDetails;
};

export const MOCK_USER_WALLET = '0xOwner';
