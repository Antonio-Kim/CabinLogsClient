import {
  HiOutlineBanknotes,
  HiOutlineBriefcase,
  HiOutlineCalendarDays,
  HiOutlineChartBar,
} from 'react-icons/hi2';
import { Booking, GetBookingsResponse } from '../../services/apiBookings';
import Stat from './Stat';

type StatsProp = {
  bookings: GetBookingsResponse | undefined;
  confirmedStays: Booking[] | undefined;
  numDays: number;
  cabinCount: number;
};

function Stats({ bookings, confirmedStays, numDays, cabinCount }: StatsProp) {
  if (!bookings || !confirmedStays) {
    return <div>No data has been received for bookings or stays</div>;
  }

  const numBookings = bookings.bookings.length;
  const sales = bookings.bookings.reduce((acc, curr) => acc + curr.totalPrice, 0);
  const checkins = confirmedStays.length;
  const occupants =
    confirmedStays.reduce((acc, curr) => acc + curr.numberOfNights, 0) / (numDays * cabinCount);
  return (
    <>
      <Stat
        title="bookings"
        color="blue"
        icon={<HiOutlineBriefcase />}
        value={String(numBookings)}
      />
      <Stat title="Sales" color="green" icon={<HiOutlineBanknotes />} value={`$${sales}`} />
      <Stat
        title="Check ins"
        color="indigo"
        icon={<HiOutlineCalendarDays />}
        value={String(checkins)}
      />
      <Stat
        title="Occupancy rate"
        color="yellow"
        icon={<HiOutlineChartBar />}
        value={`${Math.round(occupants * 100)}%`}
      />
    </>
  );
}

export default Stats;
