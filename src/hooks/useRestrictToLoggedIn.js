import { useHistory } from 'react-router-dom';
import { useAuth } from './useAuth';
import { useLayoutEffect } from 'react';

export default function useRestrictToLoggedIn() {
  const { loggedIn } = useAuth();
  const history = useHistory();

  useLayoutEffect(() => {
    if (!loggedIn) {
      history.push('/login');
    }
  }, [loggedIn, history]);
}
