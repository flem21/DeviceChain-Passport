'use client';
import Web3 from 'web3';
import type { Contract } from 'web3-eth-contract';
import type { AbiItem } from 'web3-utils';
import type { Device, RepairEventDetails, RecyclingEventDetails } from './definitions';

// --- 1. CONTRACT SETUP ---

// TODO: Replace with your actual contract address
export const CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000';

// TODO: Replace with your actual contract ABI
export const CONTRACT_ABI: AbiItem[] = [
    // This is a partial ABI for demonstration purposes.
    // You would get the full ABI from your compiled contract.
    {
        "constant": true,
        "inputs": [
            { "name": "", "type": "string" }
        ],
        "name": "devices",
        "outputs": [
            { "name": "id", "type": "string" },
            { "name": "model", "type": "string" },
            { "name": "manufacturer", "type": "string" },
            { "name": "manufacturingDate", "type": "uint256" },
            { "name": "owner", "type": "address" },
            { "name": "status", "type": "uint8" }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            { "name": "_id", "type": "string" },
            { "name": "_model", "type": "string" },
            { "name": "_manufacturer", "type": "string" },
            { "name": "_manufacturingDate", "type": "uint256" }
        ],
        "name": "registerDevice",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            { "name": "_id", "type": "string" },
            { "name": "_newOwner", "type": "address" }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {"name": "_id", "type": "string"},
            {"name": "_serviceProvider", "type": "string"},
            {"name": "_description", "type": "string"},
            {"name": "_replacedParts", "type": "string[]"}
        ],
        "name": "logRepair",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {"name": "_id", "type": "string"},
            {"name": "_recycledBy", "type": "string"},
            {"name": "_notes", "type": "string"}
        ],
        "name": "markAsRecycled",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    // Events
    {
        "anonymous": false,
        "inputs": [
            { "indexed": true, "name": "deviceId", "type": "string" },
            { "indexed": false, "name": "manufacturer", "type": "string" },
            { "indexed": false, "name": "model", "type": "string" },
            { "indexed": false, "name": "timestamp", "type": "uint256" }
        ],
        "name": "DeviceRegistered",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            { "indexed": true, "name": "deviceId", "type": "string" },
            { "indexed": true, "name": "from", "type": "address" },
            { "indexed": true, "name": "to", "type": "address" },
            { "indexed": false, "name": "timestamp", "type": "uint256" }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
    }
];

/**
 * Gets an instance of the smart contract.
 * @param web3 - The Web3 instance.
 * @returns The contract instance.
 */
export function getContract(web3: Web3): Contract<typeof CONTRACT_ABI> {
    return new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
}


// --- 2. WRITE FUNCTIONS (Transactions) ---

// These functions create and send transactions to the blockchain.
// They require the user's wallet to be connected and will prompt for a signature.

type RegisterDeviceParams = {
    id: string;
    manufacturer: string;
    model: string;
    manufacturingDate: string; // YYYY-MM-DD
    owner: string;
};
export async function registerDevice(contract: Contract<any>, params: RegisterDeviceParams) {
    const manufacturingDateUnix = Math.floor(new Date(params.manufacturingDate).getTime() / 1000);
    return contract.methods.registerDevice(
        params.id,
        params.model,
        params.manufacturer,
        manufacturingDateUnix
    ).send({ from: params.owner });
}

type TransferOwnershipParams = {
    deviceId: string;
    newOwner: string;
    currentOwner: string;
};
export async function transferOwnership(contract: Contract<any>, params: TransferOwnershipParams) {
    return contract.methods.transferOwnership(
        params.deviceId,
        params.newOwner
    ).send({ from: params.currentOwner });
}

type LogRepairParams = {
    deviceId: string;
    serviceProvider: string;
    description: string;
    replacedParts: string[];
};
export async function logRepair(contract: Contract<any>, account: string, params: LogRepairParams) {
    return contract.methods.logRepair(
        params.deviceId,
        params.serviceProvider,
        params.description,
        params.replacedParts
    ).send({ from: account });
}


type MarkAsRecycledParams = {
    deviceId: string;
    recycledBy: string;
    notes: string;
};
export async function markAsRecycled(contract: Contract<any>, account: string, params: MarkAsRecycledParams) {
     return contract.methods.markAsRecycled(
        params.deviceId,
        params.recycledBy,
        params.notes
    ).send({ from: account });
}

// --- 3. MOCK DATA for Lifecycle Events ---

// This is a placeholder for querying real blockchain events.
// The structure matches what `web3.eth.getPastEvents` would return.
export const MOCK_USER_WALLET_ADDRESS = '0x0526a52994e43f1E84a569f4Bfc2622A5f4F89B5';
export const MOCK_LIFECYCLE_EVENTS = [
  {
    event: 'DeviceRegistered',
    returnValues: { deviceId: 'SN-A1B2C3D4E5', manufacturer: 'Pixelate Inc.', model: 'Quantum 5', timestamp: '1673776800' },
    transactionHash: '0x...1', logIndex: 0
  },
  {
    event: 'OwnershipTransferred',
    returnValues: { deviceId: 'SN-A1B2C3D4E5', from: 'Pixelate Inc.', to: '0xFirstBuyer', timestamp: '1674225000' },
    transactionHash: '0x...2', logIndex: 0
  },
  {
    event: 'OwnershipTransferred',
    returnValues: { deviceId: 'SN-A1B2C3D4E5', from: '0xFirstBuyer', to: MOCK_USER_WALLET_ADDRESS, timestamp: '1685988000' },
    transactionHash: '0x...3', logIndex: 0
  },
  {
    event: 'RepairLogged',
    returnValues: { deviceId: 'SN-A1B2C3D4E5', serviceProvider: 'GadgetSavers', description: 'Screen replacement due to drop damage.', replacedParts: ['OLED Display Panel'], timestamp: '1707556500' },
    transactionHash: '0x...4', logIndex: 0
  },
  {
    event: 'DeviceRegistered',
    returnValues: { deviceId: 'SN-R4S5T6U7V8', manufacturer: 'Pixelate Inc.', model: 'Quantum Pad', timestamp: '1678459200' },
    transactionHash: '0x...7', logIndex: 0
  },
  {
    event: 'OwnershipTransferred',
    returnValues: { deviceId: 'SN-R4S5T6U7V8', from: 'Pixelate Inc.', to: MOCK_USER_WALLET_ADDRESS, timestamp: '1678898700' },
    transactionHash: '0x...8', logIndex: 0
  },
  {
    event: 'DeviceRecycled',
    returnValues: { deviceId: 'SN-R4S5T6U7V8', recycledBy: 'EcoTech Recycling', notes: 'Device disposed of at an authorized recycling center.', timestamp: '1716210000' },
    transactionHash: '0x...9', logIndex: 0
  }
];
