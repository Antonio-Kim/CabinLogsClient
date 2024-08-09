import Button from '../../ui/Button';
import { useCheckout } from './useCheckout';

type CheckoutButtonProp = {
  bookingId: number;
};

function CheckoutButton({ bookingId }: CheckoutButtonProp) {
  const { checkout, isCheckingOut } = useCheckout();

  return (
    <Button
      variation="primary"
      size="small"
      onClick={() => checkout({ bookingId: String(bookingId) })}
      disabled={isCheckingOut}
    >
      Check out
    </Button>
  );
}

export default CheckoutButton;
