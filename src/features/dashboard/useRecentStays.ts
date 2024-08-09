import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { getStaysAfterDate } from '../../services/apiBookings';

export function useRecentStays() {
  const [searchParams] = useSearchParams();

  const numDays = !searchParams.get('last') ? 7 : Number(searchParams.get('last'));

  const { isPending: isLoading, data: stays } = useQuery({
    queryFn: () => getStaysAfterDate(numDays),
    queryKey: ['stays', `last-${numDays}`],
  });

  const confirmedStays = stays?.bookings?.filter(
    (stay) => stay.status === 'checked-in' || stay.status === 'checked-out',
  );

  return { isLoading, stays, confirmedStays, numDays };
}
