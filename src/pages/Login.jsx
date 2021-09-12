import { useAuth } from "../hooks/useAuth";
import { Redirect } from "react-router-dom";
import { clientId, baseUrl } from "../config";
import { useCallback } from "react";
import { Button } from '@material-ui/core';


export default function Login() {
  const { loggedIn, startLogin } = useAuth();

  const handleClick = useCallback(
    () => startLogin({ clientId, redirectUrl: baseUrl + "/#/login-callback" }),
    [startLogin]
  );

  if (loggedIn) {
    return <Redirect to="/" />;
  }

  return <Button variant="contained" color="primary" onClick={handleClick}>Login</Button>;
}
