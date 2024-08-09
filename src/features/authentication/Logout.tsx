import { HiArrowRightOnRectangle } from 'react-icons/hi2';
import ButtonIcon from '../../ui/ButtonIcon';
import { useNavigate } from 'react-router-dom';

function Logout() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('user');
    navigate('/login');
  }
  return (
    <ButtonIcon onClick={handleLogout}>
      <HiArrowRightOnRectangle />
    </ButtonIcon>
  );
}

export default Logout;
