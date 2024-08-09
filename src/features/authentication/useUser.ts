import { useQuery } from '@tanstack/react-query';
import { userInfo } from '../../services/apiAccounts';

export function useUser() {
  const { data: user, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: userInfo,
  });

  return { isLoading, user };
}
