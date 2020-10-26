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
    alignItems: "center",
  },
  avatar: {},
  form: {
    width: "100%",
  },
  submit: {
    marginTop: 20,
    marginBottom: 20,
  },
});

export default function SignUp() {
  const createNewUser = ({
    email,
    password,
    username,
    displayName,
    point,
    avatar,
  }) => {
    firebase
      .createUser(
        { email, password },
        { username, displayName, email, point, avatar }
      )
      .catch(function (error) {
        setMsg("入力内容が正しくありません。");
        setLoaded(true);
      });
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [msg, setMsg] = useState("");
  const [loaded, setLoaded] = useState(true);
  const [usernameMsg, setUsernameMsg] = useState("");
  const classes = useStyles();
  const firebase = useFirebase();
  const db = firebase.firestore();
  const auth = useSelector((state) => state.firebase.auth);
  if (isLoaded(auth)) {
    if (auth.uid) {
      return <Redirect to="/communities" />;
    }
  }
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleDisplayNameChange = (event) => {
    setDisplayName(event.target.value);
  };

  const handleSubmit = () => {
    const regex = /^[0-9a-z]+$/;
    if (regex.test(username) !== true) {
      setUsernameMsg("ユーザー名は半角小文字英数字でお願いします。");
    } else {
      setUsernameMsg("");
    }
    setLoaded(false);
    if (username === "" || displayName === "" || !regex.test(username)) {
      setMsg("正しい情報を入力してください。");
      setLoaded(true);
    } else {
      createNewUser
      ({
        email: email,
        password: password,
        username: username,
        displayName: displayName,
        point: 0,
        avatar: "",
        notification: false,
      });
      const createNewUserProfile = {
        username: username,
        displayName: displayName,
        avatar: "",
      }

      // setTimeout(() => {
      //   const newuser = firebase.auth().currentUser.uid;
      //   db.collection('profile').doc(newuser).set(createNewUserProfile);
      // }, 2000);

      // db.collection('profile').doc
    }
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
                  label="ユーザー名(@半角英数字)"
                  type="name"
                  id="username"
                  onChange={handleUsernameChange}
                  inputProps={{
                    maxLength: 20,
                  }}
                />
                <div style={{ textAlign: "center" }}>
                  {usernameMsg && usernameMsg}
                </div>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="displayName"
                  label="表示名"
                  type="name"
                  id="displayName"
                  maxlength="20"
                  onChange={handleDisplayNameChange}
                  inputProps={{
                    maxLength: 20,
                  }}
                />
                <div style={{ textAlign: "center" }}>{msg}</div>
                {loaded ? (
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
                      href="/signin"
                      variant="body2"
                      className={classes.link}
                    >
                      ログインはこちら
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
