import { useEffect, useState } from 'react';
import { Redirect, useLocation } from 'react-router-dom';
import { clientId, clientSecret, baseUrl } from '../config';
import { useAuth } from '../hooks/useAuth';

const endpoint = 'https://cors-anywhere.herokuapp.com/https://github.com/login/oauth/access_token'

export default function LoginCallback() {
  const params = Object.fromEntries(new URLSearchParams(useLocation().search).entries());
  const { loggedIn, oauthState, completeLogin } = useAuth();
  const [error, setError] = useState(null);
  const [hasCorsError, setHasCorsError] = useState(false);

  const shouldFixUrl = !!window.location.search;

  useEffect(() => {
    async function continueLogin() {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            accept: 'application/json',
          },
          body: JSON.stringify({
            client_id: clientId,
            client_secret: clientSecret,
            code: params.code,
            redirect_url: baseUrl + '/#/login-callback',
          }),
        });

        if (response.status === 403) {
          const responseText = await response.text();
          if (responseText.indexOf('/corsdemo')) {
            setHasCorsError(true);
            setTimeout(continueLogin, 1000);
            return;
          }
        }

        setHasCorsError(false);

        const json = await response.json();

        if (json.error) {
          setError(json.error_description);
        } else {
          completeLogin(json.access_token);
        }
      } catch (e) {
        setError(e.toString());
      }
    }

    if (!shouldFixUrl) {
      if (params.error) {
        setError(params.error_description);
      } else if (!loggedIn && oauthState && params.state === oauthState && params.code) {
        continueLogin();
      }
    }
  }, [shouldFixUrl, loggedIn, oauthState, completeLogin, params.state, params.error, params.error_description, params.code]);

  if (shouldFixUrl) {
    const { origin, pathname, hash, search } = window.location;
    window.location = origin + pathname + hash + search;
    return null;
  }
  
  if (loggedIn) {
    return <Redirect to="/" />;
  }

  if (params.state !== oauthState || !oauthState) {
    return 'Wrong state';
  }

  if (hasCorsError) {
    return (
      <div>
        Please click on the button below
        <iframe title="cors-anywhere" src="https://cors-anywhere.herokuapp.com/" width="800" height="600" />
      </div>
    );
  }

  if (error) {
    return error;
  }

  return 'Loading...';
}
