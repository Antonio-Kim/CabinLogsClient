import styled from 'styled-components';

import BookingDataBox from './BookingDataBox.tsx';
import Row from '../../ui/Row';
import Heading from '../../ui/Heading';
import Tag from '../../ui/Tag';
import ButtonGroup from '../../ui/ButtonGroup';
import Button from '../../ui/Button';
import ButtonText from '../../ui/ButtonText';

import { useMoveBack } from '../../hooks/useMoveBack';
import { useBooking } from './useBooking.ts';
import Spinner from '../../ui/Spinner.tsx';
import { useNavigate } from 'react-router-dom';
import { HiArrowUpOnSquare } from 'react-icons/hi2';
import { useCheckout } from '../check-in-out/useCheckout.ts';
import Modal from '../../ui/Modal.tsx';
import ConfirmDelete from '../../ui/ConfirmDelete.tsx';
import { useDeleteBooking } from './useDeleteBooking.ts';
import Empty from '../../ui/Empty.tsx';

const HeadingGroup = styled.div`
  display: flex;
  gap: 2.4rem;
  align-items: center;
`;

function BookingDetail() {
  const { booking, isLoading } = useBooking();
  const { checkout, isCheckingOut } = useCheckout();
  const { deleteBooking, isDeleting } = useDeleteBooking();
  const moveBack = useMoveBack();
  const navigate = useNavigate();
  if (!booking) {
    return <Empty resourceName="booking" />;
  }

  if (isLoading) return <Spinner />;
  const status = booking.status ?? 'unconfirmed';
  const statusToTagName = {
    unconfirmed: 'blue',
    'checked-in': 'green',
    'checked-out': 'silver',
  };

  const handleDeleteConfirm = async () => {
    if (booking?.id) {
      try {
        await deleteBooking(String(booking.id));
        navigate(-1);
      } catch (error) {
        console.error('Error during deletion:', error);
      }
    }
  };

  return (
    <>
      <Row type="horizontal">
        <HeadingGroup>
          <Heading as="h1">Booking #{booking?.id}</Heading>
          <Tag type={statusToTagName[status as keyof typeof statusToTagName]}>
            {status.replace('-', ' ')}
          </Tag>
        </HeadingGroup>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </Row>

      <BookingDataBox booking={booking} />

      <ButtonGroup>
        {booking?.status === 'unconfirmed' && (
          <Button onClick={() => navigate(`/checkin/${booking?.id}`)}>CheckIn</Button>
        )}
        <Button variation="secondary" onClick={moveBack}>
          Back
        </Button>

        <Modal>
          <Modal.Open opens="delete">
            <Button variation="danger">Delete booking</Button>
          </Modal.Open>
          <Modal.Window name="delete">
            <ConfirmDelete
              resourceName="booking"
              onConfirm={handleDeleteConfirm}
              disabled={isDeleting}
            />
          </Modal.Window>
        </Modal>

        {status === 'checked-in' && (
          <Button
            icon={<HiArrowUpOnSquare />}
            onClick={() => checkout({ bookingId: String(booking?.id) })}
            disabled={isCheckingOut}
          >
            Check out
          </Button>
        )}
      </ButtonGroup>
    </>
  );
}

export default BookingDetail;
