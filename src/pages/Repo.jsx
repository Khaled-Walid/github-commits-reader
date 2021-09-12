import { useParams, useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import { fs, http, corsProxy } from "../git";
import git from "isomorphic-git";
import withRequireLogin from "../hocs/withRequireLogin";
import { useAuth } from "../hooks/useAuth";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";

function createCloneUrl(accessToken, username, reponame) {
  return `https://${accessToken}@github.com/${username}/${reponame}.git`;
}
const useStyles = makeStyles({
  li: {
    color: "white",
  },
});
function Repo() {
  const { oauthAccessToken } = useAuth();
  const { username, reponame } = useParams();
  const [cloning, setCloning] = useState(true);
  const [loading, setLoading] = useState(true);
  const [commits, setCommits] = useState(null);

  const dir = `/${username}/${reponame}`;
  useEffect(() => {
    async function clone() {
      try {
        await fs.promises.stat("/" + username);
      } catch {
        await fs.promises.mkdir("/" + username);
      }

      try {
        await fs.promises.stat(dir);
      } catch {
        await git.clone({
          fs,
          http,
          corsProxy,
          dir,
          url: createCloneUrl(oauthAccessToken, username, reponame),
        });
      }

      setCloning(false);
    }

    clone();
  }, [oauthAccessToken, reponame, username, dir]);

  useEffect(() => {
    async function loadCommits() {
      const commitsResult = await git.log({
        fs,
        dir,
      });

      const extracted = commitsResult.map((commitResult) => ({
        sha: commitResult.oid,
        message: commitResult.commit.message,
        author: commitResult.commit.author,
      }));
      setCommits(extracted);
      setLoading(false);
    }

    if (!cloning) {
      loadCommits();
    }
  }, [cloning, dir]);

  const classes = useStyles();

  const commitsElements =
    commits &&
    commits.map((commit) => (
      <li key={commit.sha}>
        <Typography className={classes.li}>
          Message: {commit.message} <br />
          User: {commit.author.name} <br />
          E-mail: {commit.author.email} <br />
          Date: {new Date(commit.author.timestamp * 1000).toString()}
        </Typography>
      </li>
    ));

  const commitsList = commitsElements ? <ul>{commitsElements}</ul> : null;
  const history = useHistory();

  return loading ? (
    "Loading..."
  ) : (
    <>
      {commitsList}
      <Button
        variant="contained"
        color="default"
        onClick={() => {
          history.goBack();
        }}
      >
        Back
      </Button>
    </>
  );
}

export default withRequireLogin(Repo);
