export type Setting = {
  id: number;
  created_at?: string;
  minBookingLength: number;
  maxBookingLength: number;
  maxGuestsPerBooking: number;
  breakfastPrice: number;
};

export async function getSettings(): Promise<Setting[]> {
  try {
    const response = await fetch('http://localhost:5000/settings');

    if (!response.ok) {
      throw new Error('Error occurred while fetching settings.');
    }
    const data: Setting[] = await response.json();
    return data;
  } catch (e) {
    console.error(`Error occurred: ${e}`);
    return [];
  }
}

export async function updateSetting(newSetting: Setting) {
  try {
    const response = await fetch('http://localhost:5000/settings', {
      method: 'PUT',
      body: JSON.stringify(newSetting),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Setting could not be updated.');
    }
  } catch (e) {
    throw new Error('Error occurred while updating settings.');
  }
}
