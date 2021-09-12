import { useAuth } from "./hooks/useAuth";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Repos from "./pages/Repos";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Repo from "./pages/Repo";
import { Route, Switch } from "react-router-dom";


const useStyles = makeStyles({
  root: {
    minWidth: 275,
    marginTop: "20%",
    backgroundColor: "#646464",
  },
});

export default function AppRouter() {
  const { loggedIn } = useAuth();
  const classes = useStyles();
  const buttonToRender = loggedIn ? <Logout /> : <Login />;
  return (
    <>
      <Container maxWidth="sm">
        <Card className={classes.root} variant="outlined">
          <CardContent>
            {loggedIn ? (
              <Switch>
                <Route exact path="/">
                  <Repos />
                </Route>
                <Route exact path="/:username/:reponame">
                  <Repo />
                </Route>
              </Switch>
            ) : (
              <Typography variant="h5" component="h2">
                You are not logged in!
              </Typography>
            )}
          </CardContent>
          <CardActions >{buttonToRender}</CardActions>
        </Card>
      </Container>
    </>
  );
}
