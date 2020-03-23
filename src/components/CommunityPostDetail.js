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
import Posts from "./CommunitiesTimeline/Posts";
import axios from "axios";
import Snackbar from "@material-ui/core/Snackbar";

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

export default function CommunityPostDetail() {
  let { postId, communityId } = useParams();
  const [communityName, setCommunityName] = useState("");
  const fileInput = useRef(null);
  const firebase = useFirebase();
  const db = firebase.firestore();

  firebase.firestore();

  db.collection("communities")
    .doc(communityId)
    .get()
    .then(function(doc) {
      setCommunityName(doc.data().name);
    });

  useFirestoreConnect([
    {
      collection: "communities",
      doc: communityId,
      subcollections: [{ collection: "posts", doc: postId }],
      storeAs: `posts-${communityId}`
    }
  ]);

  const posts = useSelector(
    state => state.firestore.ordered[`posts-${communityId}`]
  );
  const auth = useSelector(state => state.firebase.auth);
  const profile = useSelector(state => state.firebase.profile);
  const [openSnack, setOpenSnack] = useState(false);
  const [content, setContent] = useState("");
  const [postImage, setPostImage] = useState("");
  const [posted, setPosted] = useState(true);
  const [postMsg, setPostMsg] = useState("");
  const classes = useStyles();

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
          href={`/communities/${communityId}`}
          style={{ marginBottom: 30 }}
        >
          {communityName}コミュニティへ
        </Button>
        {!isLoaded(posts) ? (
          <div></div>
        ) : isEmpty(posts) ? (
          <div></div>
        ) : (
          posts.map(post => (
            <div>
              <Grow in={true} timeout={{ enter: 1000 }}>
                <Posts
                  id={post.id}
                  uid={post.uid}
                  communityId={communityId}
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
