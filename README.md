# DeviceChain Passport

DeviceChain Passport is a decentralized application (DApp) that provides a transparent, secure, and immutable digital identity for electronic devices using blockchain technology. It allows users to verify authenticity, track ownership, and view the entire service history of a device with confidence.

This project is built with Next.js, React, and `web3.js` to interact with a conceptual smart contract on the Ethereum blockchain.

## Problem Statement

The lifecycle of electronic devices is often opaque. Owners and potential buyers lack a reliable way to:

-   **Verify Authenticity:** Confirm that a device is genuine and not a counterfeit.
-   **Prove Ownership:** Securely prove who the current owner of a device is.
-   **Track Service History:** View a verifiable log of all repairs and modifications.
-   **Manage End-of-Life:** Ensure a device is disposed of or recycled responsibly.

This lack of transparency erodes trust in the second-hand market and complicates device management.

## Solution

DeviceChain Passport solves this by creating a unique **digital passport** for each device, stored immutably on the blockchain.

-   **Immutable Record:** Every significant event in a device's life—from creation to recycling—is recorded as a transaction on the blockchain, creating a permanent and unalterable history.
-   **Decentralized Trust:** Ownership is controlled by the user's cryptographic wallet, removing the need for a central authority to validate ownership claims.
-   **Full Transparency:** Anyone can look up a device's passport using its serial number to view its history, which increases trust for buyers and helps manufacturers track their products.

## Architecture

The application follows a standard DApp architecture where the frontend interacts directly with a smart contract on the blockchain via a user's wallet.

```ascii
+----------------+      +---------------------+      +----------------+      +--------------------+
|                |      |                     |      |                |      |                    |
|      User      | <--> |   Next.js/React     | <--> |    web3.js     | <--> |  Device Passport   |
| (with Wallet)  |      |   (Frontend DApp)   |      | (Provider)     |      | (Smart Contract)   |
|                |      |                     |      |                |      |                    |
+----------------+      +---------------------+      +----------------+      +--------------------+
                                                                                       |
                                                                                       v
                                                                            +--------------------+
                                                                            |                    |
                                                                            | Ethereum Blockchain|
                                                                            |                    |
                                                                            +--------------------+
```

-   **User:** Interacts with the web application using a browser with a wallet extension like MetaMask.
-   **Next.js/React DApp:** The client-side application that provides the user interface.
-   **web3.js:** A library that allows the frontend to communicate with the Ethereum blockchain. It handles wallet connections and contract interactions.
-   **Device Passport Smart Contract:** The backend logic deployed on the blockchain. It defines the data structures (e.g., `Device`) and functions (`registerDevice`, `transferOwnership`) that govern the system.

## User Flow

1.  **Connect Wallet:** A user visits the DApp and connects their Ethereum wallet (e.g., MetaMask).
2.  **Register a Device:** A device owner (or manufacturer) fills out a form with the device's details (serial number, model, etc.). Submitting the form initiates a `registerDevice` transaction on the smart contract, creating the digital passport. The user's wallet address is recorded as the owner.
3.  **View a Passport:** Anyone can enter a device's serial number on the homepage. The DApp reads the device's data and its history directly from the blockchain and displays it.
4.  **Manage Device:** The current owner (and only the owner) can perform actions like:
    -   **Transfer Ownership:** Initiate a transaction to transfer the device passport to a new wallet address.
    -   **Log a Repair:** Add a permanent service record to the device's history.
    -   **Mark as Recycled:** End the device's lifecycle by marking it as recycled, which prevents future transfers.
5.  **Verify History:** A potential buyer in the second-hand market can look up the device's passport to verify the owner and check its entire service history, ensuring they are making an informed purchase.

## Getting Started

To run this project locally, you will need Node.js and a wallet provider like [MetaMask](https://metamask.io/) installed in your browser.

1.  Clone the repository.
2.  Install dependencies: `npm install`
3.  Run the development server: `npm run dev`

The application will be available at `http://localhost:9002`.

> **Note:** This project is a prototype. The smart contract logic is conceptual and the interactions are set up but not connected to a live, deployed contract. To make it a fully functional DApp, you would need to write, compile, and deploy the smart contract outlined in `blockchain-contract.md`.
