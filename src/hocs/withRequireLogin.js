import useRestrictToLoggedIn from '../hooks/useRestrictToLoggedIn';

export default function withRequireLogin(Component) {
  return function(props) {
    useRestrictToLoggedIn();
    return <Component {...props} />;
  };
}
