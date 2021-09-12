import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useHistory } from "react-router-dom";
import withRequireLogin from "../hocs/withRequireLogin";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { Button, Container } from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    marginTop: "15px",
    backgroundColor: "#999393",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    textAlign: "center",
  },
  text: {
    display: "flex",
    flexDirection: "column",
    textAlign: "center"
  },
});

function Repos() {
  const { oauthAccessToken, loggedIn } = useAuth();

  const [username, setUsername] = useState(null);
  const [repos, setRepos] = useState(null);

  const getUsername = useCallback(async () => {
    const response = await fetch("https://api.github.com/user", {
      headers: {
        accept: "application/json",
        Authorization: "token " + oauthAccessToken,
      },
    });
    const json = await response.json();
    return json.login;
  }, [oauthAccessToken]);

  const getUserRepos = useCallback(
    async (username) => {
      const response = await fetch(
        "https://api.github.com/search/repositories?q=user:" + username,
        {
          headers: {
            accept: "application/json",
            Authorization: "token " + oauthAccessToken,
          },
        }
      );
      const json = await response.json();
      return json.items.map((item) => ({
        id: item.id,
        name: item.name,
        fullName: item.full_name,
        cloneUrl: item.clone_url,
      }));
    },
    [oauthAccessToken]
  );

  useEffect(() => {
    async function getData() {
      const username = await getUsername();
      const repos = await getUserRepos(username);
      setUsername(username);
      setRepos(repos);
    }

    if (loggedIn) {
      getData();
    }
  }, [getUserRepos, getUsername, loggedIn]);
  const classes = useStyles();
  const history = useHistory();
  const rendererdRepos =
    repos &&
    repos.map((repo) => {
      return (
        <Button
          className={classes.root}
          variant="outlined"
          key={repo.id}
          onClick={() => {history.push(`/${repo.fullName}`)}}
        >
          {repo.name}
        </Button>
      );
    });

  const renderAll = repos ? (
    <>
      <Typography className={classes.text} variant="h5" component="h2">
        Username: {username} <br />
        Repositories:
      </Typography>
      <Container className={classes.container}>{rendererdRepos}</Container>
    </>
  ) : (
    "Loading..."
  );

  return renderAll;
}

export default withRequireLogin(Repos);
