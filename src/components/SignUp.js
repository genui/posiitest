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
      <Link color="inherit" to="/">
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

export default function SignUp() {
  const createNewUser = ({ email, password, username }) => {
    firebase.createUser({ email, password }, { username, email });
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const classes = useStyles();
  const firebase = useFirebase();
  const auth = useSelector(state => state.firebase.auth);
  if (isLoaded(auth)) {
    if (auth.uid) {
      console.log(auth);
      return <Redirect to="/protected" />;
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

  const handleUsernameChange = event => {
    setUsername(event.target.value);
    console.log("Username" + event.target.value);
  };

  const handleSubmit = () => {
    createNewUser({
      email: email,
      password: password,
      username: username
    });
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
            ユーザー登録
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
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="username"
              label="ユーザー名(半角英数字)"
              type="name"
              id="username"
              onChange={handleUsernameChange}
            />
            <Button
              type="button"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={handleSubmit}
            >
              登録する
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
                <Link href="/signin" variant="body2" className={classes.link}>
                  ログインはこちら
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
