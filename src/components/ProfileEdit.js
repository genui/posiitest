import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useFirebase } from "react-redux-firebase";
import { useSelector } from "react-redux";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Grow from "@material-ui/core/Grow";
import Logo from "../images/logo.jpg";
import { isLoaded } from "react-redux-firebase";

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

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: 20,
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  large: {
    marginTop: 30,
    width: theme.spacing(10),
    height: theme.spacing(10),
    "&:hover": {
      cursor: "pointer",
      opacity: 0.5
    }
  },
  form: {
    width: "100%"
  },
  submit: {
    marginTop: 20,
    marginBottom: 20
  }
}));

export default function ProfileEdit() {
  const classes = useStyles();
  const firebase = useFirebase();
  const profile = useSelector(state => state.firebase.profile);

  const [displayName, setDisplayName] = useState("");
  const [profileText, setProfileText] = useState("");
  const [msg, setMsg] = useState("");

  const handleDisplayNameChange = event => {
    setDisplayName(event.target.value);
  };

  const handleProfileTextChange = event => {
    setProfileText(event.target.value);
  };
  const handleSubmit = () => {
    if (displayName !== "") {
      firebase.updateProfile({
        displayName: displayName
      });
      setMsg("プロフィールを更新しました");
    }

    if (profileText !== "") {
      firebase.updateProfile({
        profileText: profileText
      });
      setMsg("プロフィールを更新しました");
    }
    console.log("updated");
  };

  if (isLoaded(profile)) {
    return (
      <Grow in={true} timeout={{ enter: 1000 }}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className={classes.paper}>
            <Avatar src={Logo} className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              プロフィール編集
            </Typography>
            <Avatar
              alt="profile image"
              src={`${profile.avatar}`}
              className={classes.large}
            />
            <form className={classes.form} noValidate>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="displayName"
                label="表示名"
                type="name"
                id="displayName"
                InputLabelProps={{
                  shrink: true
                }}
                defaultValue={profile.displayName}
                onChange={handleDisplayNameChange}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="profile"
                label="プロフィール本文"
                type="name"
                id="profile"
                InputLabelProps={{
                  shrink: true
                }}
                defaultValue={profile.profileText}
                onChange={handleProfileTextChange}
                multiline={true}
                rows={10}
                rowsMax={10}
              />
              {msg}
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
            </form>
          </div>
          <Box mt={8}>
            <Copyright />
          </Box>
        </Container>
      </Grow>
    );
  } else {
    return <div></div>;
  }
}
