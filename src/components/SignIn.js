import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useFirebase } from "react-redux-firebase";
import { useSelector } from "react-redux";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Grow from "@material-ui/core/Grow";
import Logo from "../images/logo.jpg";
import { isLoaded } from "react-redux-firebase";
import { Redirect } from "react-router-dom";

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
  const classes = useStyles();
  const firebase = useFirebase();
  const auth = useSelector(state => state.firebase.auth);
  if (isLoaded(auth)) {
    if (auth.uid) {
      console.log(auth);
      return <Redirect to="/" />;
    }
  }
  const handleEmailChange = event => {
    setEmail(event.target.value);
    console.log("EMAIL" + event.target.value);
  };

  const handlePasswordChange = event => {
    setPassword(event.target.value);
    console.log("PASSWORD" + event.target.value);
  };

  const handleSignIn = () => {
    firebase.login({ email: email, password: password });
  };
  return (
    <Grow in={true} timeout={{ enter: 1000 }}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar src={Logo} className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
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
                <Link href="/signup" variant="body2" className={classes.link}>
                  会員登録はこちら
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
        <Box mt={8}>
          <Copyright />
        </Box>
      </Container>
    </Grow>
  );
}
