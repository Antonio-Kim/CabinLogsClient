import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getBookings } from '../../services/apiBookings';
import { useSearchParams } from 'react-router-dom';
import { PAGE_SIZE } from '../../utils/constants';

export function useBookings() {
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const filterValue = searchParams.get('status');
  const sortByRaw = searchParams.get('sortBy') || 'startDate-desc';

  const filter =
    filterValue === 'all'
      ? undefined
      : filterValue
        ? { field: 'status', value: filterValue }
        : undefined;
  const [field, direction] = sortByRaw.split('-');
  const sortBy = { field, direction };
  const page = !searchParams.get('pageIndex') ? 1 : Number(searchParams.get('pageIndex'));

  const { isPending, data, error } = useQuery({
    queryKey: ['bookings', filter, sortBy, page],
    queryFn: () => getBookings({ filter, sortBy, page }),
  });

  const bookings = data?.bookings || [];
  const totalCount = data?.totalCount || 0;
  const pageCount = Math.ceil(totalCount / PAGE_SIZE);

  if (page < pageCount) {
    queryClient.prefetchQuery({
      queryKey: ['bookings', filter, sortBy, page + 1],
      queryFn: () => getBookings({ filter, sortBy, page: page + 1 }),
    });
  }

  if (page > 1) {
    queryClient.prefetchQuery({
      queryKey: ['bookings', filter, sortBy, page - 1],
      queryFn: () => getBookings({ filter, sortBy, page: page - 1 }),
    });
  }

  return { isPending, error, bookings, totalCount };
}
