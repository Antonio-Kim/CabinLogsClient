export type Cabins = {
  id: number;
  created_at: string;
  name: string;
  maxCapacity: number;
  regularPrice: number;
  discount: number;
  description: string;
  image?: string;
};

export async function createCabin(formData: FormData): Promise<void> {
  try {
    const response = await fetch('http://localhost:5000/cabins', {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create cabin: ${errorText}`);
    }
  } catch (error) {
    console.error(`Error Occurred: ${error}`);
  }
}

export async function deleteCabin(id: number): Promise<void> {
  const response = await fetch(`http://localhost:5000/cabins/${id}`, {
    method: 'DELETE',
  });
  if (response.status === 404) {
    throw new Error('Cabin could not be deleted.');
  }
  if (!response.ok) {
    throw new Error('Failed to delete cabin.');
  }
}

export async function getCabins(): Promise<Cabins[]> {
  try {
    const response = await fetch('http://localhost:5000/cabins', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`Error occurred while fetching cabins`);
    }
    const data: Cabins[] = await response.json();
    return data;
  } catch (error) {
    console.error(`Error occurred: ${error}`);
    return [];
  }
}
