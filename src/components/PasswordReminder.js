import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { useFirebase } from "react-redux-firebase";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

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
    alignItems: "center",
  },
  avatar: {},
  form: {
    width: "100%",
  },
  submit: {
    marginTop: 30,
    marginBottom: 20,
  },
});

export default function PasswordReminder() {
  const firebase = useFirebase();
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const EmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordReminder = async (e) => {
    console.log(email);
    var status;
    await firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(function () {
        status = true;
      })
      .catch(function (error) {
        status = false;
      });
    if (status === true) {
      setEmail("");
      setMsg("メールを送信しました。ご確認をお願いします。");
    } else {
      setMsg("メールアドレスが正しくありません");
    }
  };
  const classes = useStyles();
  console.log(msg);
  const message = String(msg);

  return (
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
              パスワード再発行
            </Typography>
            <p>
              パスワードを再発行する場合、メールアドレスを入力してください。
            </p>
            <form className={classes.form}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="メールアドレス"
                name="email"
                value={email}
                onChange={EmailChange}
                autoComplete="email"
                autoFocus
              />
              <p>{message}</p>
              <Button
                type="button"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={handlePasswordReminder}
              >
                パスワードを再発行する
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="/signin" variant="body2" className={classes.link}>
                    ログインはこちら
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
        </CardContent>
      </Card>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}
