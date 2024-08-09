import { useQuery } from '@tanstack/react-query';
import { getBooking } from '../../services/apiBookings';
import { useParams } from 'react-router-dom';

export function useBooking() {
  const { bookingId } = useParams();
  if (bookingId === undefined) {
    throw new Error('BookingId is undefined');
  }
  const {
    isLoading,
    data: booking,
    error,
  } = useQuery({
    queryKey: ['booking', bookingId],
    queryFn: () => getBooking(Number(bookingId)),
    retry: false,
  });

  return { isLoading, booking, error };
}
