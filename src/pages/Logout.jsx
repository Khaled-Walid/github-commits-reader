import { useAuth } from '../hooks/useAuth';
import { Button } from '@material-ui/core';

export default function Logout() {
  const { logout } = useAuth();

  return <Button variant="contained" color="secondary" onClick={logout}>Logout</Button>;
}
