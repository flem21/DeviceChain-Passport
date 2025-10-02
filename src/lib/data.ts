import type { Contract } from 'web3-eth-contract';
import type { Device, LifecycleEvent } from './definitions';
import { MOCK_LIFECYCLE_EVENTS, MOCK_USER_WALLET_ADDRESS } from './contract';

// --- Helper Functions to format data from contract ---

function formatDeviceFromContract(contractData: any): Device {
  const statusNumber = Number(contractData.status); // Convert BigInt to Number
  let status: 'active' | 'recycled' = 'active';
  if (statusNumber === 1) {
    status = 'recycled';
  }

  return {
    id: contractData.id,
    manufacturer: contractData.manufacturer,
    model: contractData.model,
    // Convert Unix timestamp (seconds) to ISO string
    manufacturingDate: new Date(Number(contractData.manufacturingDate) * 1000).toISOString(),
    owner: contractData.owner,
    status: status,
    imageUrl: `https://picsum.photos/seed/${contractData.id}/600/400`,
    imageHint: 'device',
  };
}

function formatLifecycleEventFromContract(contractEvent: any): LifecycleEvent {
    const eventTypeMap: { [key: string]: LifecycleEvent['type'] } = {
        "DeviceRegistered": 'creation',
        "OwnershipTransferred": 'transfer',
        "RepairLogged": 'repair',
        "DeviceRecycled": 'recycling',
    };

    const eventType = eventTypeMap[contractEvent.event];
    let details: any = {};

    switch(eventType) {
        case 'creation':
            details = {
                manufacturer: contractEvent.returnValues.manufacturer,
                model: contractEvent.returnValues.model,
            };
            break;
        case 'transfer':
            details = {
                from: contractEvent.returnValues.from,
                to: contractEvent.returnValues.to,
            };
            break;
        case 'repair':
            details = {
                serviceProvider: contractEvent.returnValues.serviceProvider,
                description: contractEvent.returnValues.description,
                replacedParts: contractEvent.returnValues.replacedParts || []
            };
            break;
        case 'recycling':
            details = {
                recycledBy: contractEvent.returnValues.recycledBy,
                notes: contractEvent.returnValues.notes || '',
            };
            break;
    }

    return {
        id: contractEvent.transactionHash + contractEvent.logIndex,
        deviceId: contractEvent.returnValues.deviceId,
        type: eventType,
        // Convert Unix timestamp (seconds) to ISO string
        timestamp: new Date(Number(contractEvent.returnValues.timestamp) * 1000).toISOString(),
        details,
    }
}


// --- Data Access Functions ---
// These functions now interact with the smart contract.

export async function getDeviceById(contract: Contract<any>, id: string): Promise<Device | undefined> {
  try {
    // Call the 'devices' mapping on the smart contract
    const result = await contract.methods.devices(id).call();
    if (result.id) { // Check if a device was actually returned
        return formatDeviceFromContract(result);
    }
    return undefined;
  } catch (error) {
    console.error(`Error fetching device ${id}:`, error);
    throw new Error('Could not fetch device from the blockchain.');
  }
}

export async function getDevicesByOwner(contract: Contract<any>, owner: string): Promise<Device[]> {
  try {
     // This is a conceptual implementation. A real contract would need a way to
     // query devices by owner, which can be complex.
     // For now, we will use a mock return, assuming the contract could do this.
    console.warn("getDevicesByOwner is using mock data. A real contract needs an efficient way to query by owner.");
    
    if (owner.toLowerCase() === MOCK_USER_WALLET_ADDRESS.toLowerCase()) {
        const device1 = await getDeviceById(contract, 'SN-A1B2C3D4E5');
        const device2 = await getDeviceById(contract, 'SN-R4S5T6U7V8');
        return [device1, device2].filter(d => d !== undefined) as Device[];
    }
    
    return [];

  } catch (error) {
    console.error(`Error fetching devices for owner ${owner}:`, error);
    throw new Error('Could not fetch devices from the blockchain.');
  }
}

export async function getDeviceLifecycle(contract: Contract<any>, deviceId: string): Promise<LifecycleEvent[]> {
  try {
    // In a real DApp, you would query past events from the blockchain.
    // Web3.js provides `contract.getPastEvents`.
    // For this prototype, we'll return a mock history for recognized device IDs.
    
    console.warn("getDeviceLifecycle is using mock data. A real implementation would use contract.getPastEvents.");

    const MOCK_EVENTS = MOCK_LIFECYCLE_EVENTS;

    const filteredEvents = MOCK_EVENTS
        .filter(event => event.returnValues.deviceId === deviceId)
        .map(formatLifecycleEventFromContract);
    
    return filteredEvents.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  } catch (error) {
    console.error(`Error fetching lifecycle for device ${deviceId}:`, error);
    throw new Error('Could not fetch device lifecycle from the blockchain.');
  }
}
