import React, { useState, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useFirebase, useFirestoreConnect } from "react-redux-firebase";
import { useSelector } from "react-redux";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { AddAPhoto } from "@material-ui/icons";
import { isLoaded, isEmpty } from "react-redux-firebase";
import Grow from "@material-ui/core/Grow";
import CircularProgress from "@material-ui/core/CircularProgress";
import GestPosts from "./Gest/GestPosts";
import axios from "axios";
import Snackbar from "@material-ui/core/Snackbar";
import { useParams } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import Linkify from "material-ui-linkify";

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
  textarea: {
    height:100
  }
}));

export default function GestCommunitiesTimeline() {
  const { communityId } = useParams();
  const fileInput = useRef(null);
  const firebase = useFirebase();
  const db = firebase.firestore();

  firebase.firestore();
  useFirestoreConnect([
    {
      collection: "communities",
      doc: communityId,
      subcollections: [{ collection: "posts" }],
      orderBy: ["createTime", "desc"],
      storeAs: `posts-${communityId}`,
    },
  ]);

  const posts = useSelector(
    (state) => state.firestore.ordered[`posts-${communityId}`]
  );

  const auth = useSelector((state) => state.firebase.auth);
  const profile = useSelector((state) => state.firebase.profile);
  const [openSnack, setOpenSnack] = useState(false);
  const [content, setContent] = useState("");
  const [postImage, setPostImage] = useState("");
  const [posted, setPosted] = useState(true);
  const [postMsg, setPostMsg] = useState("");
  const [communityName, setCommunityName] = useState("");
  const [communityText, setCommunityText] = useState("");
  const [communityPublic, setCommunityPublic] = useState(true);
  const [communityPublicGlobal, setCommunityPublicGlobal] = useState(true);
  const [communityRole, setCommunityRole] = useState(false);
  const [communityButton, setCommunityButton] = useState(true);
  const [communityDisplay, setCommunityDisplay] = useState(true);
  const classes = useStyles();
  db.collection("communities")
    .doc(communityId)
    .get()
    .then(function (doc) {
      console.log(doc.data());
      setCommunityName(doc.data().name);
      setCommunityText(doc.data().text);
      setCommunityPublic(doc.data().public);
      setCommunityPublicGlobal(doc.data().publicGlobal);
      console.log(doc.data().publicGlobal);
    });
  
  // db.collection("communities")
  //   .doc(communityId)
  //   .collection("members")
  //   .doc(auth.uid)
  //   .get()
  //   .then(function (doc) {
  //     if (doc.data()) {
  //       setCommunityRole(doc.data().role);
  //       if (communityRole === "regist") {
  //         setCommunityButton(false);
  //       }
  //     }
  //     if (communityPublic === true || communityRole === "member") {
  //       setCommunityDisplay(true);
  //     } else {
  //       setCommunityDisplay(false);
  //     }
  //   });

  

  const handleContentChange = (event) => {
    setContent(event.target.value);
  };

  const handleImageChange = (event) => {
    const file = event.target.files;
    setPostImage(file[0]);
  };
  const handleImageClick = (event) => {
    fileInput.current.click();
  };

  const handleSnackClose = () => {
    setOpenSnack(false);
  };
  return (
    <div className={classes.root}>
      <Container component="main" maxWidth="sm">
        <Card style={{ marginBottom: 20 }}>
          <CardContent>
            <Typography
              gutterBottom
              variant="h5"
              component="h2"
              style={{ color: "#000" }}
            >
              {communityName}{" "}
              <span style={{ fontSize: 15 }}>
                {!communityPublic && " 非公開"}
              </span>
            </Typography>
            <Linkify>
              <Typography
                variant="body2"
                color="textSecondary"
                component="p"
                style={{ whiteSpace: "pre-line" }}
              >
                {communityText}
              </Typography>
            </Linkify>
            {!communityPublic　&& (
              <div>
                <Typography variant="body2" color="textSecondary" component="p">
                  ※このページは非公開です。
                </Typography>
                {/* 　
                {communityButton ? (
                  <Button
                    type="button"
                    variant="contained"
                    color="primary"
                    style={{ marginTop: 10 }}
                  >
                    参加を希望する
                  </Button>
                ) : (
                  <div>申請中です</div>
                )} */}
              </div>
            )}
          </CardContent>
        </Card>
        
        {!communityPublic ? (
          <div></div>
        ) : !isLoaded(posts) ? (
          <div></div>
        ) : isEmpty(posts) ? (
          <div></div>
        ) : (
          posts.map((post) => (
            <div>
              <Grow in={true} timeout={{ enter: 1000 }}>
                <GestPosts
                  id={post.id}
                  communityId={communityId}
                  uid={post.uid}
                  createTime={post.createTime}
                  avatar={post.avatar}
                  displayName={post.displayName}
                  content={post.content}
                  postImage={post.postImage}
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

