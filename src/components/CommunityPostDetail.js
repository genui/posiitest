import React, { useState, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useFirebase, useFirestoreConnect } from "react-redux-firebase";
import { useSelector } from "react-redux";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import { useParams } from "react-router-dom";
import { isLoaded, isEmpty } from "react-redux-firebase";
import Grow from "@material-ui/core/Grow";
import Posts from "./CommunitiesTimeline/Posts";
import Snackbar from "@material-ui/core/Snackbar";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#f8f8f8",
    flexGrow: 1,
    minHeight: 500,
    paddingTop: 30,
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  flex: {
    flexGrow: 1,
  },
  link: {
    textDecoration: "none",
    color: "black",
  },
  button: {
    color: "white",
  },
  middle: {
    width: theme.spacing(6),
    height: theme.spacing(6),
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  camera: {
    marginRight: 10,
    verticalAlign: "middle",
    "&:hover": {
      cursor: "pointer",
      opacity: 0.5,
    },
  },
  delete: {
    "&:hover": {
      cursor: "pointer",
      opacity: 0.5,
    },
  },
  comment: {
    "&:hover": {
      cursor: "pointer",
      opacity: 0.5,
    },
  },
  like: {
    "&:hover": {
      cursor: "pointer",
      opacity: 0.5,
    },
  },
  liked: {
    color: "#fa9200",
  },
  snackbar: {
    backgroundColor: "#fa9200",
  },
  postButtons: {
    display: "flex",
    flexFlow: "wrap",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  commentButtons: {
    display: "flex",
    flexFlow: "wrap",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
}));

export default function CommunityPostDetail() {
  let { postId, communityId } = useParams();
  const [communityName, setCommunityName] = useState("");
  const firebase = useFirebase();
  const db = firebase.firestore();

  firebase.firestore();

  db.collection("communities")
    .doc(communityId)
    .get()
    .then(function (doc) {
      setCommunityName(doc.data().name);
    });

  useFirestoreConnect([
    {
      collection: "communities",
      doc: communityId,
      subcollections: [{ collection: "posts", doc: postId }],
      storeAs: `posts-${communityId}`,
    },
  ]);

  const posts = useSelector(
    (state) => state.firestore.ordered[`posts-${communityId}`]
  );
  const [openSnack, setOpenSnack] = useState(false);
  const [postMsg, setPostMsg] = useState("");
  const classes = useStyles();

  const handleSnackClose = () => {
    setPostMsg("");
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
          posts.map((post) => (
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
          horizontal: "center",
        }}
        open={openSnack}
        onClose={handleSnackClose}
        autoHideDuration={5000}
        message={<span>{postMsg}</span>}
        ContentProps={{
          classes: {
            root: classes.snackbar,
          },
        }}
      />
    </div>
  );
}
