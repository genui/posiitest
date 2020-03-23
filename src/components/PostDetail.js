import React, { useState, useRef } from "react";
import PromiseValue from "promise-value";
import { makeStyles } from "@material-ui/core/styles";
import { useFirebase, useFirestoreConnect } from "react-redux-firebase";
import { useSelector } from "react-redux";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import { useParams } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { AddAPhoto } from "@material-ui/icons";
import { isLoaded, isEmpty } from "react-redux-firebase";
import Grow from "@material-ui/core/Grow";
import CircularProgress from "@material-ui/core/CircularProgress";
import Posts from "./Timeline/Posts";
import axios from "axios";
import Snackbar from "@material-ui/core/Snackbar";
import CardHeader from "@material-ui/core/CardHeader";

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: "#f8f8f8",
    flexGrow: 1,
    minHeight: 500,
    paddingTop: 30
  },
  media: {
    height: 0,
    paddingTop: "56.25%" // 16:9
  },
  flex: {
    flexGrow: 1
  },
  link: {
    textDecoration: "none",
    color: "black"
  },
  button: {
    color: "white"
  },
  middle: {
    width: theme.spacing(6),
    height: theme.spacing(6)
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7)
  },
  camera: {
    marginRight: 10,
    verticalAlign: "middle",
    "&:hover": {
      cursor: "pointer",
      opacity: 0.5
    }
  },
  delete: {
    "&:hover": {
      cursor: "pointer",
      opacity: 0.5
    }
  },
  comment: {
    "&:hover": {
      cursor: "pointer",
      opacity: 0.5
    }
  },
  like: {
    "&:hover": {
      cursor: "pointer",
      opacity: 0.5
    }
  },
  liked: {
    color: "#fa9200"
  },
  snackbar: {
    backgroundColor: "#fa9200"
  },
  postButtons: {
    display: "flex",
    flexFlow: "wrap",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20
  },
  commentButtons: {
    display: "flex",
    flexFlow: "wrap",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20
  }
}));

export default function PostDetail() {
  let { postId } = useParams();
  const fileInput = useRef(null);
  const firebase = useFirebase();
  const db = firebase.firestore();

  firebase.firestore();

  useFirestoreConnect([
    {
      collection: "posts",
      doc: postId
    }
  ]);

  const posts = useSelector(state => state.firestore.ordered.posts);

  const auth = useSelector(state => state.firebase.auth);
  const profile = useSelector(state => state.firebase.profile);
  const [openSnack, setOpenSnack] = useState(false);
  const [content, setContent] = useState("");
  const [postImage, setPostImage] = useState("");
  const [posted, setPosted] = useState(true);
  const [postMsg, setPostMsg] = useState("");
  const classes = useStyles();

  const handleContentChange = event => {
    setContent(event.target.value);
  };

  const handleImageChange = event => {
    const file = event.target.files;
    setPostImage(file[0]);
  };
  const handleImageClick = event => {
    fileInput.current.click();
  };

  const handleContentSubmit = () => {
    if (content !== "") {
      setPosted(false);
      const params = { text: content };
      const url = "https://myflaskapi1234321.herokuapp.com/";
      axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";

      axios
        .get(url, { params })
        .then(results => {
          if (results.data.result === "5" || results.data.result === "4") {
            setOpenSnack(true);
            setPostMsg("ポジティブな投稿をお願いします。");
            setPosted(true);
          } else {
            setPosted(false);
            if (postImage.name) {
              const filePath = "postImage";
              const date = new Date();
              const a = date.getTime();
              const b = Math.floor(a / 1000);
              const storageRef = firebase.storage().ref(filePath);
              const filePre = `${b}-${profile.username}`;
              const fileName = postImage.name;
              const imageRef = `${filePre}-${fileName}`;
              function splitExt(filename) {
                return filename.split(/\.(?=[^.]+$)/);
              }
              function thumbnailName(filename) {
                const filePre = splitExt(filename);
                return `${filePre[0]}_1000x1000.${filePre[1]}`;
              }

              const fileRef = storageRef
                .child(imageRef)
                .put(postImage)
                .then(snapshot => {
                  const uploadedPath = `thumbnails/${filePre}-${thumbnailName(
                    fileName
                  )}`;
                  setTimeout(() => {
                    const url = storageRef
                      .child(uploadedPath)
                      .getDownloadURL()
                      .then(function(url) {
                        db.collection("posts").add({
                          uid: auth.uid,
                          avatar: profile.avatar,
                          displayName: profile.displayName,
                          postImage: url,
                          username: profile.username,
                          content: content,
                          createTime: firebase.firestore.FieldValue.serverTimestamp(),
                          likeCount: 0
                        });
                        setPosted(true);
                        setContent("");
                        setPostImage("");
                        setPostMsg("ポジティブな投稿をありがとうございます。");
                        setOpenSnack(true);
                      });
                  }, 5000);
                })
                .catch(error => {
                  setPosted(true);
                  setPostImage("");
                  setPostMsg("10MB以下の画像をお願いします。");
                  setOpenSnack(true);
                });
            } else {
              db.collection("posts").add({
                uid: auth.uid,
                avatar: profile.avatar,
                displayName: profile.displayName,
                username: profile.username,
                content: content,
                createTime: firebase.firestore.FieldValue.serverTimestamp(),
                likeCount: 0
              });
              setPosted(true);
              setContent("");
              setPostMsg("投稿が完了しました。");
              setOpenSnack(true);
              setPostImage("");
            }
          }
        })
        .catch(error => {
          alert(error);
        });
    }
  };

  const handleSnackClose = () => {
    setOpenSnack(false);
  };

  return (
    <div className={classes.root}>
      <Container component="main" maxWidth="sm">
        <Button
          type="button"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          href="/"
          style={{ marginBottom: 30 }}
        >
          トップページへ
        </Button>
        {!isLoaded(posts) ? (
          <div></div>
        ) : isEmpty(posts) ? (
          <div>
            <Grow in={true} timeout={{ enter: 1000 }}>
              <Card className={classes.card} style={{ marginBottom: 20 }}>
                <CardHeader subheader={"投稿はありません。"} />
              </Card>
            </Grow>
          </div>
        ) : (
          posts.map(post => (
            <div>
              <Grow in={true} timeout={{ enter: 1000 }}>
                <Posts
                  id={post.id}
                  uid={post.uid}
                  createTime={post.createTime}
                  avatar={post.avatar}
                  displayName={post.displayName}
                  content={post.content}
                  postImage={post.postImage}
                  likeCount={post.likeCount}
                />
              </Grow>
            </div>
          ))
        )}
      </Container>
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center"
        }}
        open={openSnack}
        onClose={handleSnackClose}
        autoHideDuration={5000}
        message={<span>{postMsg}</span>}
        ContentProps={{
          classes: {
            root: classes.snackbar
          }
        }}
      />
    </div>
  );
}
