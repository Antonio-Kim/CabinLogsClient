import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { getBookingsAfterDate } from '../../services/apiBookings';

export function useRecentBookings() {
  const [searchParams] = useSearchParams();

  const numDays = !searchParams.get('last') ? 7 : Number(searchParams.get('last'));

  const { isPending: isLoading, data: bookings } = useQuery({
    queryFn: () => getBookingsAfterDate(numDays),
    queryKey: ['bookings', `last-${numDays}`],
  });

  return { isLoading, bookings };
}
