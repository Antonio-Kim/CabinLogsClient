import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Booking, updateBooking } from '../../services/apiBookings';
import toast from 'react-hot-toast';

type MutationProps = {
  bookingId: string;
  breakfast?: {
    hasBreakfast: boolean;
    extrasPrice: number;
    totalPrice: number;
  };
};

export function useCheckout() {
  const queryClient = useQueryClient();
  const { mutate: checkout, isPending: isCheckingOut } = useMutation({
    mutationFn: ({ bookingId }: MutationProps) =>
      updateBooking(bookingId, {
        status: 'checked-out',
      }),

    onSuccess: (data: Booking) => {
      toast.success(`Booking #${data.id} successfully checked out`);
      queryClient.invalidateQueries();
    },
    onError: (error: Error) => {
      toast.error(`Failed to check out: ${error.message}`);
    },
  });

  return { checkout, isCheckingOut };
}
