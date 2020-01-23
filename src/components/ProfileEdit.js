import React, { useState, useRef } from "react";
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
import { isLoaded } from "react-redux-firebase";
import CircularProgress from "@material-ui/core/CircularProgress";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

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
    width: theme.spacing(13),
    height: theme.spacing(13),
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
  const fileInput = useRef(null);
  const classes = useStyles();
  const firebase = useFirebase();
  const profile = useSelector(state => state.firebase.profile);

  const [displayName, setDisplayName] = useState("");
  const [profileText, setProfileText] = useState("");
  const [msg, setMsg] = useState("");
  const [uploaded, setUploaded] = useState(true);

  const handleDisplayNameChange = event => {
    setDisplayName(event.target.value);
  };

  const handleClick = () => {
    fileInput.current.click();
  };

  const handleAvaterChange = event => {
    setUploaded(false);
    const file = event.target.files;
    const filePath = "avatars";
    function splitExt(filename) {
      return filename.split(/\.(?=[^.]+$)/);
    }
    function thumbnailName(filename) {
      const filePre = splitExt(filename);
      return `${filePre[0]}_200x200.${filePre[1]}`;
    }
    if (file[0].name) {
      const date = new Date();
      const a = date.getTime();
      const b = Math.floor(a / 1000);
      const storageRef = firebase.storage().ref(filePath);
      const filePre = `${b}-${profile.username}`;
      const fileName = file[0].name;
      const imageRef = `${filePre}-${fileName}`;

      const fileRef = storageRef
        .child(imageRef)
        .put(file[0])
        .then(snapshot => {
          const uploadedPath = `thumbnails/${filePre}-${thumbnailName(
            fileName
          )}`;
          console.log(snapshot.state);
          console.log(uploadedPath);
          setTimeout(() => {
            const url = storageRef
              .child(uploadedPath)
              .getDownloadURL()
              .then(function(url) {
                console.log(url);
                firebase.updateProfile({
                  avatar: url
                });
                setUploaded(true);
              });
          }, 5000);
        });
    }
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
        <Container component="main" maxWidth="sm">
          <CssBaseline />
          <Card
            className={classes.card}
            variant="outlined"
            style={{ marginTop: 30, marginBottom: 30 }}
          >
            <CardContent>
              <div className={classes.paper}>
                <Typography component="h1" variant="h5">
                  編集 {profile.username}
                </Typography>
                <Button onClick={() => handleClick()}>
                  {uploaded ? (
                    <Avatar
                      alt="profile image"
                      src={`${profile.avatar}`}
                      className={classes.large}
                    />
                  ) : (
                    <div>
                      <CircularProgress />
                      <p>アップロードしています...</p>
                    </div>
                  )}
                  <input
                    type="file"
                    id="avaterForm"
                    onChange={handleAvaterChange}
                    ref={fileInput}
                    style={{
                      display: "none"
                    }}
                  />
                </Button>
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
                    更新
                  </Button>
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
  } else {
    return <div></div>;
  }
}
