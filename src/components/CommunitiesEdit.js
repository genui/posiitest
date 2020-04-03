import React, { useState, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  useFirebase,
  useFirestoreConnect,
  isLoaded,
  isEmpty
} from "react-redux-firebase";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
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
import CardMedia from "@material-ui/core/CardMedia";
import { AddAPhoto } from "@material-ui/icons";
import { useHistory } from "react-router-dom";
import Snackbar from "@material-ui/core/Snackbar";
import Switch from "@material-ui/core/Switch";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";

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
  },
  media: {
    height: 200,
    "&:hover": {
      cursor: "pointer",
      opacity: 0.5
    }
  }
}));

export default function CommunityEdit() {
  let { communityId } = useParams();
  const history = useHistory();
  const fileInput = useRef(null);
  const classes = useStyles();
  const firebase = useFirebase();
  const db = firebase.firestore();
  const auth = useSelector(state => state.firebase.auth);

  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [updateName, setUpdateName] = useState("");
  const [updateText, setUpdateText] = useState("");
  const [image, setImage] = useState("");
  const [uid, setUid] = useState("");
  const [publicFlg, setPublic] = useState("");
  const [displayForm, setDisplayForm] = useState(false);
  const [uploaded, setUploaded] = useState(true);
  const [imageUploaded, setImageUploaded] = useState(true);
  const [communityImage, setCommunityImage] = useState("");
  const [openSnack, setOpenSnack] = useState(false);
  const [snackMsg, setSnackMsg] = useState(false);

  db.collection("communities")
    .doc(communityId)
    .get()
    .then(function(doc) {
      setName(doc.data().name);
      setText(doc.data().text);
      setUid(doc.data().uid);
      setImage(doc.data().image);
      setPublic(doc.data().public);
      setDisplayForm(true);

      if (isLoaded(auth) && auth.uid !== doc.data().uid) {
        history.push("/");
      }
    });

  const handlePublicChange = event => {
    if (publicFlg) {
      db.collection("communities")
        .doc(communityId)
        .update({ public: false });
      setPublic(false);
      setSnackMsg("非公開にしました。");
      setOpenSnack(true);
    } else {
      db.collection("communities")
        .doc(communityId)
        .update({ public: true });
      setPublic(true);
      setSnackMsg("公開にしました。");
      setOpenSnack(true);
    }
  };

  const handleNameChange = event => {
    setUpdateName(event.target.value);
  };

  const handleImageClick = event => {
    fileInput.current.click();
  };

  const handleTextChange = event => {
    setUpdateText(event.target.value);
  };

  const handleSnackClose = () => {
    setOpenSnack(false);
  };

  const handleSubmit = () => {
    if (updateName !== "" && updateText !== "") {
      setUploaded(false);
      db.collection("communities")
        .doc(communityId)
        .update({
          name: updateName,
          text: updateText
        })
        .then(function() {
          setUploaded(true);
          setText("");
          setName("");
          setSnackMsg("更新が完了しました。");
          setOpenSnack(true);
        })
        .catch(function(error) {
          console.log(error);
          setSnackMsg("エラーが発生しました");
          setOpenSnack(true);
        });
    }

    if (updateName === "" && updateText !== "") {
      setUploaded(false);
      db.collection("communities")
        .doc(communityId)
        .update({
          text: updateText
        })
        .then(function() {
          setUploaded(true);
          setText("");
          setName("");
          setSnackMsg("更新が完了しました。");
          setOpenSnack(true);
        })
        .catch(function(error) {
          console.log(error);
          setSnackMsg("エラーが発生しました");
          setOpenSnack(true);
        });
    }

    if (updateName !== "" && updateText === "") {
      setUploaded(false);
      db.collection("communities")
        .doc(communityId)
        .update({
          name: updateName
        })
        .then(function() {
          setUploaded(true);
          setText("");
          setName("");
          setSnackMsg("更新が完了しました。");
          setOpenSnack(true);
        })
        .catch(function(error) {
          console.log(error);
          setSnackMsg("エラーが発生しました");
          setOpenSnack(true);
        });
    }
  };

  const handleClick = () => {
    fileInput.current.click();
  };

  const handleImageChange = event => {
    setImageUploaded(false);
    const file = event.target.files;
    const filePath = "communityImage";

    if (file[0].name) {
      const filePath = "communityImage";
      const date = new Date();
      const a = date.getTime();
      const b = Math.floor(a / 1000);
      const storageRef = firebase.storage().ref(filePath);
      const fileName = communityImage.name;
      const imageRef = `${b}-${fileName}`;

      const fileRef = storageRef
        .child(imageRef)
        .put(file[0])
        .then(snapshot => {
          const uploadedPath = `${b}-${fileName}`;
          setTimeout(() => {
            const url = storageRef
              .child(uploadedPath)
              .getDownloadURL()
              .then(function(url) {
                db.collection("communities")
                  .doc(communityId)
                  .update({
                    image: url
                  });
                setImageUploaded(true);
              });
          }, 5000);
        });
    }
  };

  return (
    <div>
      {displayForm && (
        <Grow in={true} timeout={{ enter: 1000 }}>
          <Container component="main" maxWidth="sm">
            <Button
              type="button"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              href="/communities"
              style={{ marginBottom: 30 }}
            >
              コミュニティ一覧へ戻る
            </Button>
            <CssBaseline />
            <Card
              className={classes.card}
              variant="outlined"
              style={{ marginBottom: 30 }}
            >
              <CardContent>
                {imageUploaded ? (
                  <CardMedia
                    className={classes.media}
                    image={image}
                    title="Contemplative Reptile"
                    style={{ backgroundColor: "#EEE" }}
                    onClick={handleClick}
                  />
                ) : (
                  <div style={{ textAlign: "center" }}>
                    <CircularProgress />
                  </div>
                )}
                <input
                  type="file"
                  id="imageForm"
                  onChange={handleImageChange}
                  ref={fileInput}
                  style={{
                    display: "none"
                  }}
                />
                <div className={classes.paper}>
                  <form className={classes.form} noValidate>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      name="name"
                      label="コミュニティ名"
                      type="text"
                      id="name"
                      InputLabelProps={{
                        shrink: true
                      }}
                      onChange={handleNameChange}
                      inputProps={{
                        maxLength: 20
                      }}
                      defaultValue={name}
                    />
                    <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      name="text"
                      defaultValue={text}
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
                    </div>
                    <div>
                      <Typography
                        gutterBottom
                        variant="body2"
                        component="body2"
                        style={{ color: "#000" }}
                      >
                        公開する
                      </Typography>
                      <Switch
                        checked={publicFlg}
                        onChange={handlePublicChange}
                        name="public"
                        inputProps={{ "aria-label": "secondary checkbox" }}
                      />
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
                        更新する
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
            {!publicFlg && <UserList id={communityId} />}
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
      )}
    </div>
  );
}

function UserList(props) {
  const firebase = useFirebase();
  const db = firebase.firestore();
  const communityId = props.id;
  const classes = useStyles();
  const [openSnack, setOpenSnack] = useState(false);
  const [snackMsg, setSnackMsg] = useState(false);

  useFirestoreConnect([
    {
      collection: "communities",
      doc: communityId,
      subcollections: [{ collection: "members" }],
      where: ["role", "==", "regist"],
      storeAs: `members-${communityId}`
    }
  ]);

  const communityMembers = useSelector(
    state => state.firestore.ordered[`members-${communityId}`]
  );

  const handleSnackClose = () => {
    setOpenSnack(false);
  };

  const handleClickButton = event => {
    const id = event.currentTarget.id;
    db.collection("communities")
      .doc(communityId)
      .collection("members")
      .doc(id)
      .update({
        role: "member"
      })
      .then(function() {
        setSnackMsg("承認しました");
        setOpenSnack(true);
      });
  };

  return (
    <div>
      {!isLoaded(communityMembers) ? (
        <div></div>
      ) : isEmpty(communityMembers) ? (
        <div>
          <Typography
            gutterBottom
            variant="h5"
            component="h2"
            style={{ color: "#000" }}
          >
            承認待ち
          </Typography>
          <Card className={classes.card} style={{ marginBottom: 20 }}>
            <CardHeader subheader={"承認待ちはありません"} />
          </Card>
        </div>
      ) : (
        <div>
          <Typography
            gutterBottom
            variant="h5"
            component="h2"
            style={{ color: "#000" }}
          >
            承認待ち
          </Typography>
          {communityMembers.map(communityMember => (
            <div>
              <Card className={classes.card} style={{ marginBottom: 20 }}>
                <CardHeader
                  avatar={
                    <Avatar
                      aria-label="recipe"
                      src={communityMember.avatar}
                      className={classes.avatar}
                    />
                  }
                  title={communityMember.displayName}
                  action={
                    <Button
                      type="button"
                      variant="contained"
                      color="primary"
                      style={{ marginTop: 10 }}
                      onClick={handleClickButton}
                      id={communityMember.uid}
                    >
                      承認する
                    </Button>
                  }
                />
              </Card>
            </div>
          ))}
        </div>
      )}
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
    </div>
  );
}
