const API_URL = import.meta.env.VITE_API_URL;

export type Guest = {
  id: number;
  created_at: string;
  fullName?: string;
  email?: string;
  nationalId?: string;
  nationality?: string;
  countryFlag?: string;
};

export async function getGuests(): Promise<Guest[]> {
  try {
    const response = await fetch(`${API_URL}/guests`);
    if (!response.ok) {
      throw new Error('Error occurred while fetching guests.');
    }
    const data: Guest[] = await response.json();
    return data;
  } catch (e) {
    console.error(`Error occurred ${e}`);
    return [];
  }
}

export async function getGuest(id: number): Promise<Guest | void> {
  try {
    const response = await fetch(`${API_URL}/guests/${id}`);
    if (!response.ok) {
      throw new Error('Error occurred while fetching guest.');
    }
    const data: Guest = await response.json();
    return data;
  } catch (e) {
    console.error(`Error occurred: ${e}`);
  }
}
