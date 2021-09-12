import { createContext, useState, useCallback, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { nanoid } from 'nanoid';

const AuthContext = createContext();

export function AuthContextProvider({ children }) {
  const initialOauthState = localStorage.getItem('oauthState');
  const initialOauthAccessToken = localStorage.getItem('oauthAccessToken');

  const [oauthState, setOauthState] = useState(initialOauthState);
  const [oauthAccessToken, setOauthAccessToken] = useState(initialOauthAccessToken);
  const value = { oauthState, oauthAccessToken, setOauthState, setOauthAccessToken };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const { oauthState, oauthAccessToken, setOauthState, setOauthAccessToken } = useContext(AuthContext);
  const history = useHistory();

  const startLogin = useCallback(({ clientId, redirectUrl }) => {
    const random = nanoid();
    localStorage.setItem('oauthState', random);
    localStorage.removeItem('oauthAccessToken');
    setOauthState(random);
    setOauthAccessToken(null);

    const base = 'https://github.com/login/oauth/authorize?';
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_url: redirectUrl,
      scope: 'repo,read:user',
      state: random,
    });
    window.location = base + params.toString();
  }, [setOauthState, setOauthAccessToken]);

  const completeLogin = useCallback(accessToken => {
    localStorage.removeItem('oauthState');
    localStorage.setItem('oauthAccessToken', accessToken);
    setOauthState(null);
    setOauthAccessToken(accessToken);

    window.location = window.location.origin + window.location.pathname;
  }, [setOauthState, setOauthAccessToken]);

  const logout = useCallback(() => {
    localStorage.removeItem('oathState');
    localStorage.removeItem('oauthAccessToken');
    setOauthState(null);
    setOauthAccessToken(null);

    history.push('/');
  }, [setOauthState, setOauthAccessToken, history]);

  const loggedIn = !!oauthAccessToken;

  return {
    oauthState,
    oauthAccessToken,
    startLogin,
    completeLogin,
    logout,
    loggedIn,
  };
}
