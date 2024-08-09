import { PAGE_SIZE } from '../utils/constants';
import { Cabins } from './apiCabins';
import { Guest } from './apiGuests';

export type Booking = {
  id: number;
  created_at: string;
  startDate: string;
  endDate: string;
  numberOfNights: number;
  numGuests: number;
  cabinPrice: number;
  extrasPrice: number;
  totalPrice: number;
  status: string;
  hasBreakfast: boolean;
  isPaid: boolean;
  observations: string;
  cabinId: number;
  guestId: number;
  cabin?: Cabins | null;
  guest?: Guest | null;
};

type GetBookingsProp = {
  filter?: {
    field: string;
    value: string;
  };
  sortBy?: {
    field: string;
    direction: string;
  };
  page?: number;
};

export type GetBookingsResponse = {
  bookings: Booking[];
  totalCount: number;
};

type UpdateStatus = {
  status: 'unconfirmed' | 'checked-in' | 'checked-out' | 'confirmed';
  isPaid?: boolean;
};

export async function updateBooking(id: string, obj: UpdateStatus): Promise<Booking> {
  try {
    const response = await fetch(`http://localhost:5000/bookings/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(obj),
    });
    if (!response.ok) {
      throw new Error('Error occurred while updating booking.');
    }
    const data: Booking = await response.json();
    return data;
  } catch (e) {
    console.error(`Error occurred: ${e}`);
    throw e;
  }
}

export async function deleteBooking(id: string): Promise<void> {
  try {
    const response = await fetch(`http://localhost:5000/bookings/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Error occurred while deleting booking');
    }
  } catch (e) {
    console.error(`Error occurred: ${e}`);
  }
}

export async function getBooking(id: number): Promise<Booking | void> {
  try {
    const response = await fetch(`http://localhost:5000/bookings/${id}`);
    if (!response.ok) {
      throw new Error('Error occurred while fetching booking.');
    }
    const bookingData: Booking = await response.json();

    return bookingData;
  } catch (e) {
    console.error(`Error occured: ${e}`);
  }
}

export async function getBookings({
  filter,
  sortBy,
  page,
}: GetBookingsProp): Promise<GetBookingsResponse> {
  try {
    let url = 'http://localhost:5000/bookings';
    const query = new URLSearchParams();

    if (filter) {
      query.append(`${filter.field}`, `${filter.value}`);
    }
    if (sortBy) {
      query.append('options', sortBy.field);
      query.append('sortOrder', sortBy.direction);
    }
    if (page) {
      query.append('pageIndex', String(page - 1));
      query.append('pageSize', String(PAGE_SIZE));
    }

    if (query.toString()) {
      url += `?${query.toString()}`;
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Error occurred while fetching bookings.');
    }
    const responseBody: GetBookingsResponse = await response.json();
    return {
      bookings: responseBody.bookings,
      totalCount: responseBody.totalCount,
    };
  } catch (e) {
    console.error(`Error occurred ${e}`);
    return {
      bookings: [],
      totalCount: 0,
    };
  }
}

export async function getBookingsAfterDate(date: number): Promise<GetBookingsResponse> {
  try {
    let url = 'http://localhost:5000/bookings';
    const query = new URLSearchParams();

    if (date) {
      query.append('created', String(date));
    }

    if (query.toString()) {
      url += `?${query.toString()}`;
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Error occurred while fetching bookings.');
    }

    const responseBody: GetBookingsResponse = await response.json();
    return {
      bookings: responseBody.bookings,
      totalCount: responseBody.totalCount,
    };
  } catch (e) {
    console.error(`Error occurred ${e}`);
    return {
      bookings: [],
      totalCount: 0,
    };
  }
}

export async function getStaysAfterDate(date: number): Promise<GetBookingsResponse> {
  try {
    let url = 'http://localhost:5000/bookings';
    const query = new URLSearchParams();

    if (date) {
      query.append('start', String(date));
    }

    if (query.toString()) {
      url += `?${query.toString()}`;
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Error occurred while fetching bookings.');
    }

    const responseBody: GetBookingsResponse = await response.json();
    return {
      bookings: responseBody.bookings,
      totalCount: responseBody.totalCount,
    };
  } catch (e) {
    console.error(`Error occurred ${e}`);
    return {
      bookings: [],
      totalCount: 0,
    };
  }
}

export async function getStaysTodayActivity(): Promise<GetBookingsResponse> {
  // 1. Retrieve the values that are confirmed
  // 2. Fiter out the data to today
  // 3. Retrieve the value that are chcked-in
  // 4. Filter ou the values that are today
  // 5. Merge the daata together
  try {
    const unconfirmedURL = `http://localhost:5000/bookings?status=unconfirmed&start=7`;
    const checkedinURL = `http://localhost:5000/bookings?status=checked-in&start=7`;
    // const today = new Date().toISOString().split('T')[0];
    const today = '2024-08-04';

    const unconfirmedResponse = await fetch(unconfirmedURL);
    const checkedinResponse = await fetch(checkedinURL);

    const unconfirmedData = await unconfirmedResponse.json();
    const checkedinData = await checkedinResponse.json();

    const filteredUnconfirmedToday = unconfirmedData.bookings.filter((data: Booking) => {
      const todayData = new Date(data.startDate).toISOString().split('T')[0];
      return todayData === today;
    });
    const filteredCheckedInToday = checkedinData.bookings.filter((data: Booking) => {
      const todayData = new Date(data.startDate).toISOString().split('T')[0];
      return todayData === today;
    });
    const data: Booking[] = [...filteredCheckedInToday, ...filteredUnconfirmedToday];
    const totalCount = data.length;
    return {
      bookings: data,
      totalCount,
    };
  } catch (e) {
    throw new Error("Could not retrieve today's data");
  }
}
