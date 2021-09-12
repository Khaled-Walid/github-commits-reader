import { HashRouter as Router } from "react-router-dom";
import { AuthContextProvider } from "./hooks/useAuth";
import AppRouter from "./AppRouter";
import { Route, Switch } from "react-router-dom";
import LoginCallback from "./pages/LoginCallback";

function App() {
  return (
    <AuthContextProvider>
      <Router>
        <Switch>
          <Route exact path="/login-callback">
            <LoginCallback />
          </Route>
          <Route path="/">
            <AppRouter />
          </Route>
        </Switch>
      </Router>
    </AuthContextProvider>
  );
}

export default App;
