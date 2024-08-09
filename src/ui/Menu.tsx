import React, { createContext, ReactNode, useContext, useState } from 'react';
import { createPortal } from 'react-dom';
import { HiEllipsisVertical } from 'react-icons/hi2';
import styled from 'styled-components';
import { useOutsideClick } from '../hooks/useOutsideClick';

const Menu = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const StyledToggle = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
  transform: translateX(0.8rem);
  transition: all 0.2s;

  &:hover {
    background-color: var(--color-grey-100);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-700);
  }
`;

const StyledList = styled.ul<StyledListProps>`
  position: fixed;

  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-md);
  border-radius: var(--border-radius-md);

  right: ${(props) => (props.position ? `${props.position.x}px` : '0')};
  top: ${(props) => (props.position ? `${props.position.y}px` : '0')};
`;

const StyledButton = styled.button`
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: 1.2rem 2.4rem;
  font-size: 1.4rem;
  transition: all 0.2s;

  display: flex;
  align-items: center;
  gap: 1.6rem;

  &:hover {
    background-color: var(--color-grey-50);
  }

  & svg {
    width: 1.6rem;
    height: 1.6rem;
    color: var(--color-grey-400);
    transition: all 0.3s;
  }
`;

type StyledListProps = {
  position: {
    x: number;
    y: number;
  } | null;
  children: ReactNode;
};

type MenuProps = {
  children: ReactNode;
};

type ToggleProps = {
  id: string;
};

type ListProps = {
  id: string;
  children: ReactNode;
};

type ButtonProps = {
  children: ReactNode;
  icon?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
};

type MenusContextProps = {
  openId: string;
  position: {
    x: number;
    y: number;
  } | null;
  open: (id: string) => void;
  close: () => void;
  setPosition: (position: { x: number; y: number } | null) => void;
};
const MenusContext = createContext<MenusContextProps | undefined>(undefined);

function Menus({ children }: MenuProps) {
  const [openId, setOpenId] = useState('');
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const close = () => setOpenId('');
  const open = (id: string) => setOpenId(id);
  return (
    <MenusContext.Provider value={{ openId, open, close, position, setPosition }}>
      {children}
    </MenusContext.Provider>
  );
}

function Toggle({ id }: ToggleProps) {
  const context = useContext(MenusContext);
  if (context == undefined) {
    throw new Error('Toggle requires context.');
  }
  const { openId, close, open, setPosition } = context;

  function handeClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    const button = e.currentTarget.closest('button');
    const rect = button?.getBoundingClientRect();
    setPosition({
      x: rect?.width ? window.innerWidth - rect?.width - rect?.x : 0,
      y: rect ? rect.y + rect.height + 8 : 0,
    });
    openId === '' || openId !== id ? open(id) : close();
  }

  return (
    <StyledToggle onClick={handeClick}>
      <HiEllipsisVertical />
    </StyledToggle>
  );
}
function List({ id, children }: ListProps) {
  const context = useContext(MenusContext);
  if (context == undefined) {
    throw new Error('Toggle requires context.');
  }
  const { openId, position, close } = context;
  const ref = useOutsideClick<HTMLUListElement>(close, false);

  if (openId !== id) return null;

  return createPortal(
    <StyledList position={position} ref={ref as React.RefObject<HTMLUListElement>}>
      {children}
    </StyledList>,
    document.body,
  );
}
function Button({ children, icon, onClick }: ButtonProps) {
  const context = useContext(MenusContext);
  if (context === undefined) {
    throw new Error('Toggle requires context.');
  }
  const { close } = context;
  function handleClick() {
    onClick?.();
    close();
  }
  return (
    <li>
      <StyledButton onClick={handleClick}>
        {icon}
        <span>{children}</span>
      </StyledButton>
    </li>
  );
}

Menus.Menu = Menu;
Menus.Toggle = Toggle;
Menus.List = List;
Menus.Button = Button;

export default Menus;
