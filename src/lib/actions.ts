'use server';

import { redirect } from 'next/navigation';

// NOTE: This file is now primarily for non-blockchain related server actions.
// The main application logic has been moved to client-side interactions with the smart contract.

export async function searchDevice(formData: FormData) {
  const serialNumber = formData.get('serialNumber') as string;
  if (!serialNumber) return;

  // We redirect directly to the device page. That page will handle
  // fetching the data from the blockchain or showing a not-found state.
  redirect(`/devices/${serialNumber}`);
}
