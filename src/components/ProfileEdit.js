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
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Grow from "@material-ui/core/Grow";
import { isLoaded } from "react-redux-firebase";
import CircularProgress from "@material-ui/core/CircularProgress";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Snackbar from "@material-ui/core/Snackbar";
import { Chip, Modal } from "@material-ui/core";

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

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: 20,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  large: {
    width: theme.spacing(13),
    height: theme.spacing(13),
    "&:hover": {
      cursor: "pointer",
      opacity: 0.5,
    },
  },
  form: {
    width: "100%",
  },
  submit: {
    marginTop: 20,
    marginBottom: 20,
  },
  snackbar: {
    backgroundColor: "#fa9200",
  },
  snsIconGroup: {
    textAlign: 'center',
  },
  snsIconCss: {
    margin: 10,
    width: theme.spacing(28),
    height: theme.spacing(7),
  },
}));

export default function ProfileEdit() {
  const fileInput = useRef(null);
  const classes = useStyles();
  const firebase = useFirebase();
  const profile = useSelector((state) => state.firebase.profile);
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [profileText, setProfileText] = useState("");
  const [usernameMsg, setUsernameMsg] = useState("");
  const [uploaded, setUploaded] = useState(true);
  const [openSnack, setOpenSnack] = useState(false);
  const [snackMsg, setSnackMsg] = useState(false);
  const db = firebase.firestore();
  const [updateDisplayName, setupdateDisplayName] = useState("");
  const [updateProfileText, setupdateProfileText] = useState("");


  const handleDisplayNameChange = (event) => {
    setDisplayName(event.target.value);
  };

  const handleSnackClose = () => {
    setOpenSnack(false);
  };

  const handleClick = () => {
    fileInput.current.click();
  };
  
  
  const userPageProfile = () =>{
    const currentUser = firebase.auth().currentUser.uid;
    let profileRef = db.collection('profile').doc(currentUser);
    db.collection('users').doc(currentUser).get().then((doc) => {

      if ({displayName}.displayName === ''){
        let setProfile = profileRef.set({
          avatar:doc.data().avatar,
          displayName: profile.displayName,
          profileText: doc.data().profileText
        });
      }
      else{
        let setProfile = profileRef.set({
          avatar:doc.data().avatar,
          displayName: {displayName}.displayName,
          profileText: doc.data().profileText
        });
      }
      profileRef.get().then((doc)=>{
        const newdisplayName = doc.data().displayName
        if ({profileText}.profileText === ''){
          let setProfile = profileRef.set({
            avatar:doc.data().avatar,
            displayName: newdisplayName,
            profileText: profile.profileText
          });
        }
        else{
          let setProfile = profileRef.set({
            avatar:doc.data().avatar,
            displayName: newdisplayName,
            profileText: {profileText}.profileText
          });
        }
      })

  })
  }




  const handleAvaterChange = (event) => {
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

      storageRef
        .child(imageRef)
        .put(file[0])
        .then((snapshot) => {
          const uploadedPath = `thumbnails/${filePre}-${thumbnailName(
            fileName
          )}`;
          setTimeout(() => {
            storageRef
              .child(uploadedPath)
              .getDownloadURL()
              .then(function (url) {
                firebase.updateProfile({
                  avatar: url,
                });
                setUploaded(true);
              });
          }, 5000);
        });
    }
  };

  const handleProfileTextChange = (event) => {
    setProfileText(event.target.value);
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleSubmit = () => {
    const regex = /^[0-9a-z]+$/;
    userPageProfile()

    if (displayName !== "") {
      firebase.updateProfile({
        displayName: displayName,
      });
      setSnackMsg("プロフィールを更新しました");
      setOpenSnack(true);

    }

    if (username !== "") {
      if (regex.test(username) === true) {
        firebase.updateProfile({
          username: username,
        });
        setSnackMsg("プロフィールを更新しました");
        setOpenSnack(true);
      } else {
        if (regex.test(username) !== true) {
          setUsernameMsg("ユーザー名は半角小文字英数字でお願いします。");
        }
      }
    }

    if (profileText !== "") {
      firebase.updateProfile({
        profileText: profileText,
      });
      setSnackMsg("プロフィールを更新しました");
      setOpenSnack(true);
    }
  };
  // const open = () => {
  //   console.log();
  // }
  // const close = () => {
  //   console.log();
  // }


  // const snsIcon = 
  // <div className={classes.snsIconGroup}>
  //   <Chip
  //     label='Instagram'
  //     className={classes.snsIconCss}
  //     avatar={
  //       <Avatar
  //         className={classes.iconSize}
  //         src='/instagram.png'
  //       />
  //     }/>
    
  //   <Chip
  //     label='Twitter'
  //     className={classes.snsIconCss}
  //     avatar={
  //       <Avatar
  //         src='/instagram.png'
  //       />
  //     }/>
    
  //   <Chip
  //     label='TikTok'
  //     className={classes.snsIconCss}
  //     avatar={
  //       <Avatar
  //         src='/instagram.png'
  //       />
  //     }/>
    
  //   <Chip
  //     label='LINE'
  //     className={classes.snsIconCss}
  //     avatar={
  //       <Avatar
  //         src='/instagram.png'
  //       />
  //     }/>
    
  //   <Modal
  //     open={open}
  //     onClose={close}>
  //     'test'
  //   </Modal>
  // </div> 



  if (isLoaded(profile)) {
    return (
      <div>
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
                        display: "none",
                      }}
                    />
                  </Button>
                  <form className={classes.form} noValidate>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      name="username"
                      label="ユーザー名(半角英数字)"
                      type="name"
                      id="username"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{
                        maxLength: 20,
                      }}
                      defaultValue={profile.username}
                      onChange={handleUsernameChange}
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
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{
                        maxLength: 20,
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
                        shrink: true,
                      }}
                      defaultValue={profile.profileText}
                      onChange={handleProfileTextChange}
                      multiline={true}
                      rows={10}
                      rowsMax={10}
                      inputProps={{
                        maxLength: 2000,
                      }}
                    />
                    {/* {snsIcon} */}
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
        <Snackbar
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          open={openSnack}
          onClose={handleSnackClose}
          autoHideDuration={5000}
          message={<span>{snackMsg}</span>}
          ContentProps={{
            classes: {
              root: classes.snackbar,
            },
          }}
        />
      </div>
    );
  } else {
    return <div></div>;
  }
}
