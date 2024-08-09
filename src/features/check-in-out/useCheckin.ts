import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Booking, updateBooking } from '../../services/apiBookings';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

type MutationProps = {
  bookingId: string;
  breakfast?: {
    hasBreakfast: boolean;
    extrasPrice: number;
    totalPrice: number;
  };
};

export function useCheckin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutate: checkin, isPending: isCheckingIn } = useMutation({
    mutationFn: ({ bookingId, breakfast }: MutationProps) =>
      updateBooking(bookingId, {
        status: 'checked-in',
        isPaid: true,
        ...(breakfast || {}),
      }),

    onSuccess: (data: Booking) => {
      toast.success(`Booking #${data.id} successfully checked in`);
      queryClient.invalidateQueries();
      navigate('/');
    },
    onError: (error: Error) => {
      toast.error(`Failed to check in: ${error.message}`);
    },
  });

  return { checkin, isCheckingIn };
}
