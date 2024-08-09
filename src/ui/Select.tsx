import { ReactNode, SelectHTMLAttributes } from 'react';
import styled from 'styled-components';

const StyledSelect = styled.select<StyledSelectProps>`
  font-size: 1.4rem;
  padding: 0.8rem 1.2rem;
  border: 1px solid
    ${(props) => (props.type === 'white' ? 'var(--color-grey-100)' : 'var(--color-grey-300)')};
  border-radius: var(--border-radius-sm);
  background-color: var(--color-grey-0);
  font-weight: 500;
  box-shadow: var(--shadow-sm);
`;

type StyledSelectProps = {
  type?: string;
  value?: string;
  children?: ReactNode;
};

type SelectProps = {
  options: { value: string; label: string }[];
  value?: string;
  type?: string;
} & SelectHTMLAttributes<HTMLSelectElement>;

function Select({ options, value, onChange, ...props }: SelectProps) {
  return (
    <StyledSelect value={value} onChange={onChange} {...props}>
      {options.map((option) => (
        <option value={option.value} key={option.value}>
          {option.label}
        </option>
      ))}
    </StyledSelect>
  );
}

export default Select;
