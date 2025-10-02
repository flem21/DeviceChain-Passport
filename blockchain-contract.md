# Device Passport Smart Contract (Conceptual Outline)

This document outlines the conceptual structure for a smart contract that could power the DeviceChain Passport application. This is **not** valid Solidity code, but rather a blueprint of the data, functions, and events that would be required.

## 1. Core Data Structures

The contract would need to store information about each device and its history.

### `Device` Struct
This would hold the primary attributes of a device.

```
struct Device {
  string id; // Serial number, the primary key
  string model;
  string manufacturer;
  uint256 manufacturingDate;
  address owner; // The Ethereum address of the current owner
  Status status; // e.g., Active, Recycled
}
```

### `LifecycleEvent` Struct
This would represent a single event in the device's history.

```
struct LifecycleEvent {
  uint id;
  EventType eventType; // e.g., Creation, Transfer, Repair
  uint256 timestamp;
  string details; // JSON string or other encoded format for event-specific data
}
```

### Enums
Enums would make the code more readable.

```
enum Status { Active, Recycled }
enum EventType { Creation, Transfer, Repair, Recycling }
```

## 2. State Variables (Storage)

The contract needs to store the data on the blockchain. Mappings are ideal for this.

```
// Mapping from serial number (string) to the Device struct
mapping(string => Device) public devices;

// Mapping from a serial number to an array of its lifecycle events
mapping(string => LifecycleEvent[]) public deviceLifecycle;

// A way to track all registered device IDs
string[] private allDeviceIds;
```

## 3. Events

Events are crucial for off-chain applications to listen to changes in the contract's state without having to constantly poll it.

```
event DeviceRegistered(string indexed deviceId, address indexed owner);
event OwnershipTransferred(string indexed deviceId, address indexed from, address indexed to);
event RepairLogged(string indexed deviceId, string serviceProvider);
event DeviceRecycled(string indexed deviceId);
```

## 4. Functions

These are the actions that users and the application can call on the contract.

### Write Functions (State-Changing)

These functions would require a transaction (and gas fees) to execute.

*   `registerDevice(string memory _id, string memory _model, ...)`
    *   Requires that the device ID doesn't already exist.
    *   Sets the `msg.sender` (the caller) as the initial owner.
    *   Creates the `Device` struct and a `Creation` lifecycle event.
    *   Emits the `DeviceRegistered` event.

*   `transferOwnership(string memory _id, address _newOwner)`
    *   Requires that `msg.sender` is the current owner.
    *   Requires that the device is not `Recycled`.
    *   Updates the `owner` on the `Device` struct.
    *   Adds a `Transfer` event to the lifecycle.
    *   Emits the `OwnershipTransferred` event.

*   `logRepair(string memory _id, string memory _serviceProvider, ...)`
    *   Could be restricted to the owner or an authorized repairer role.
    *   Adds a `Repair` event to the lifecycle.
    *   Emits the `RepairLogged` event.

*   `markAsRecycled(string memory _id)`
    *   Requires that `msg.sender` is the current owner.
    *   Changes the device `status` to `Recycled`.
    *   Adds a `Recycling` event to the lifecycle.
    *   Emits the `DeviceRecycled` event.

### Read Functions (View/Pure)

These functions are free to call and just retrieve data.

*   `getDevice(string memory _id) public view returns (Device memory)`
    *   Returns the `Device` struct for a given ID.

*   `getDeviceLifecycle(string memory _id) public view returns (LifecycleEvent[] memory)`
    *   Returns the full history for a given device ID.

*   `isOwner(string memory _id, address _user) public view returns (bool)`
    *   A helper function to check if a specific address owns a device.
```