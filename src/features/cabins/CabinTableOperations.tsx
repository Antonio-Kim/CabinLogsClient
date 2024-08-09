import TableOperations from '../../ui/TableOperations';
import Filter from '../../ui/Filter';
import SortBy from '../../ui/SortBy';

function CabinTableOperations() {
  return (
    <TableOperations>
      <Filter
        filteredField="discount"
        options={[
          { value: 'all', label: 'All' },
          { value: 'no-discount', label: 'No Discount' },
          { value: 'with-discount', label: 'With Discount' },
        ]}
      />
      <SortBy
        options={[
          {
            value: 'name-asc',
            label: 'Sort by name (A-Z)',
          },
          {
            value: 'name-desc',
            label: 'Sort by name (Z-A)',
          },
          {
            value: 'regularPrice-asc',
            label: 'Sort By Price (low)',
          },
          {
            value: 'regularPrice-desc',
            label: 'Sort By Price (high)',
          },
          {
            value: 'maxCapacity-asc',
            label: 'Sort By Capacity (low)',
          },
          {
            value: 'maxCapacity-desc',
            label: 'Sort By Capacity (high)',
          },
        ]}
      />
    </TableOperations>
  );
}

export default CabinTableOperations;
