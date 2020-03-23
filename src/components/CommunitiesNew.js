import React, { useState, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useFirebase } from "react-redux-firebase";
import { useSelector } from "react-redux";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Grow from "@material-ui/core/Grow";
import CircularProgress from "@material-ui/core/CircularProgress";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { AddAPhoto } from "@material-ui/icons";
import { useHistory } from "react-router-dom";
import Snackbar from "@material-ui/core/Snackbar";

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
  },
  camera: {
    marginRight: 10,
    verticalAlign: "middle",
    "&:hover": {
      cursor: "pointer",
      opacity: 0.5
    }
  },
  snackbar: {
    backgroundColor: "#fa9200"
  }
}));

export default function CommunityNew() {
  const history = useHistory();
  const fileInput = useRef(null);
  const classes = useStyles();
  const firebase = useFirebase();
  const db = firebase.firestore();
  const auth = useSelector(state => state.firebase.auth);

  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [uploaded, setUploaded] = useState(true);
  const [communityImage, setCommunityImage] = useState("");
  const [openSnack, setOpenSnack] = useState(false);
  const [snackMsg, setSnackMsg] = useState(false);

  const handleNameChange = event => {
    setName(event.target.value);
  };

  const handleImageClick = event => {
    fileInput.current.click();
  };

  const handleImageChange = event => {
    const file = event.target.files;
    setCommunityImage(file[0]);
  };

  const handleTextChange = event => {
    setText(event.target.value);
  };

  const handleSnackClose = () => {
    setOpenSnack(false);
  };

  const handleSubmit = () => {
    if (name !== "" && text !== "") {
      if (communityImage.name) {
        setUploaded(false);
        const filePath = "communityImage";
        const date = new Date();
        const a = date.getTime();
        const b = Math.floor(a / 1000);
        const storageRef = firebase.storage().ref(filePath);
        const fileName = communityImage.name;
        const imageRef = `${b}-${fileName}`;

        storageRef
          .child(imageRef)
          .put(communityImage)
          .then(snapshot => {
            const uploadedPath = `${b}-${fileName}`;
            setTimeout(() => {
              storageRef
                .child(uploadedPath)
                .getDownloadURL()
                .then(function(url) {
                  db.collection("communities").add({
                    uid: auth.uid,
                    name: name,
                    text: text,
                    image: url,
                    createTime: firebase.firestore.FieldValue.serverTimestamp(),
                    updateTime: firebase.firestore.FieldValue.serverTimestamp(),
                    public: true
                  });
                  setUploaded(true);
                  setText("");
                  setName("");
                  setCommunityImage("");
                  setSnackMsg("作成しました。");
                  setOpenSnack(true);
                  setInterval(function() {
                    history.push("/communities");
                  }, 1000);
                });
            }, 5000);
          })
          .catch(error => {
            setUploaded(true);
            setCommunityImage("");
            setSnackMsg("10MB以下の画像をお願いします。");
            setOpenSnack(true);
          });
      } else {
        setUploaded(false);
        db.collection("communities")
          .add({
            uid: auth.uid,
            name: name,
            text: text,
            image: "",
            createTime: firebase.firestore.FieldValue.serverTimestamp(),
            updateTime: firebase.firestore.FieldValue.serverTimestamp(),
            public: true
          })
          .then(function() {
            setUploaded(true);
            setText("");
            setName("");
            setCommunityImage("");
            setSnackMsg("作成しました。");
            setOpenSnack(true);
            setInterval(function() {
              history.push("/communities");
            }, 1000);
          })
          .catch(error => {
            setUploaded(true);
            setSnackMsg("エラーが発生しました");
            setOpenSnack(true);
          });
      }
    }
  };

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
              <form className={classes.form} noValidate>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="displayName"
                  label="コミュニティ名"
                  type="name"
                  value={name}
                  id="displayName"
                  InputLabelProps={{
                    shrink: true
                  }}
                  inputProps={{
                    maxLength: 20
                  }}
                  onChange={handleNameChange}
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="text"
                  value={text}
                  label="説明文"
                  type="text"
                  id="text"
                  InputLabelProps={{
                    shrink: true
                  }}
                  onChange={handleTextChange}
                  multiline={true}
                  rows={10}
                  rowsMax={10}
                  inputProps={{
                    maxLength: 200
                  }}
                />
                <div onClick={handleImageClick}>
                  <input
                    type="file"
                    id="imageForm"
                    onChange={handleImageChange}
                    ref={fileInput}
                    style={{
                      display: "none"
                    }}
                  />
                  <AddAPhoto className={classes.camera} />
                  <span style={{ verticalAlign: "middle", fontSize: 14 }}>
                    {communityImage.name}
                  </span>
                </div>
                {uploaded ? (
                  <Button
                    type="button"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    onClick={handleSubmit}
                  >
                    作成
                  </Button>
                ) : (
                  <div style={{ textAlign: "center" }}>
                    <CircularProgress />
                  </div>
                )}
              </form>
            </div>
          </CardContent>
        </Card>
        <Box mt={8}>
          <Copyright />
        </Box>
        <Snackbar
          anchorOrigin={{
            vertical: "top",
            horizontal: "center"
          }}
          open={openSnack}
          onClose={handleSnackClose}
          autoHideDuration={5000}
          message={<span>{snackMsg}</span>}
          ContentProps={{
            classes: {
              root: classes.snackbar
            }
          }}
        />
      </Container>
    </Grow>
  );
}
