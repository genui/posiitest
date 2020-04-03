import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useFirebase } from "react-redux-firebase";
import { useSelector } from "react-redux";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Grow from "@material-ui/core/Grow";
import { isLoaded } from "react-redux-firebase";
import { Redirect } from "react-router-dom";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CircularProgress from "@material-ui/core/CircularProgress";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://posii.ai">
        POSII
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles({
  paper: {
    marginTop: 20,
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {},
  form: {
    width: "100%"
  },
  submit: {
    marginTop: 20,
    marginBottom: 20
  }
});

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginMsg, setLoginMsg] = useState("");
  const [loaded, setLoaded] = useState(true);
  const classes = useStyles();
  const firebase = useFirebase();
  const auth = useSelector(state => state.firebase.auth);
  if (isLoaded(auth)) {
    if (auth.uid) {
      console.log(auth);
      return <Redirect to="/communities" />;
    }
  }
  const handleEmailChange = event => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = event => {
    setPassword(event.target.value);
  };

  const handleSignIn = () => {
    setLoaded(false);
    firebase.login({ email: email, password: password }).catch(function(error) {
      setLoginMsg("入力内容が正しくありません。");
      setLoaded(true);
    });
  };
  return (
    <Grow in={true} timeout={{ enter: 1000 }}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Card
          className={classes.card}
          variant="outlined"
          style={{ marginTop: 30, marginBottom: 30 }}
        >
          <CardContent>
            <div className={classes.paper}>
              <Typography component="h1" variant="h5">
                ログイン
              </Typography>
              <form className={classes.form} noValidate>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="メールアドレス"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  onChange={handleEmailChange}
                  autocapitalize="off"
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="パスワード"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  onChange={handlePasswordChange}
                />
                {loaded ? (
                  <div>
                    <div style={{ textAlign: "center" }}>{loginMsg}</div>
                    <Button
                      type="button"
                      fullWidth
                      variant="contained"
                      color="primary"
                      className={classes.submit}
                      onClick={handleSignIn}
                    >
                      ログインする
                    </Button>
                  </div>
                ) : (
                  <div style={{ textAlign: "center" }}>
                    <CircularProgress style={{ textAlign: "center" }} />
                  </div>
                )}
                <Grid container>
                  <Grid item xs>
                    <Link
                      href="/password_reminder"
                      variant="body2"
                      className={classes.link}
                    >
                      パスワードをお忘れですか?
                    </Link>
                  </Grid>
                  <Grid item>
                    <Link
                      href="/signup"
                      variant="body2"
                      className={classes.link}
                    >
                      会員登録はこちら
                    </Link>
                  </Grid>
                </Grid>
              </form>
            </div>
          </CardContent>
        </Card>
        <Box mt={8}>
          <Copyright />
        </Box>
      </Container>
    </Grow>
  );
}
