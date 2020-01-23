import React, { useState, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useFirebase, useFirestoreConnect } from "react-redux-firebase";
import { useSelector } from "react-redux";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import { AddAPhoto, Comment } from "@material-ui/icons";
import { isLoaded, isEmpty } from "react-redux-firebase";
import Link from "@material-ui/core/Link";
import Grow from "@material-ui/core/Grow";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import { set } from "date-fns";
import Chip from "@material-ui/core/Chip";

import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import FolderIcon from "@material-ui/icons/Folder";
import RestoreIcon from "@material-ui/icons/Restore";
import FavoriteIcon from "@material-ui/icons/Favorite";
import DeleteOutline from "@material-ui/icons/DeleteOutline";

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: "#fDfDfD",
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
  likedNumber: {
    fontSize: 20,
    verticalAlign: "top",
    paddingTop: 5,
    paddingRight: 5
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
function dateDisplay(date) {
  const dt = date.toDate();
  const year = dt.getFullYear();
  const month = dt.getMonth() + 1;
  const day = dt.getDate();
  return `${year}年${month}月${day}日`;
}

function PostLike(props) {
  const classes = useStyles();
  const firebase = useFirebase();
  const db = firebase.firestore();
  const auth = useSelector(state => state.firebase.auth);
  firebase.firestore();
  const [liked, setLiked] = React.useState("");
  const likeChange = () => {
    if (props.id !== "") {
      db.collection("posts")
        .doc(props.id)
        .collection("postLikes")
        .doc(auth.uid)
        .get()
        .then(function(doc) {
          if (doc.exists) {
            setLiked(true);
          } else {
            setLiked(false);
          }
        })
        .catch(function(error) {
          console.log("Error getting document:", error);
        });
    }
  };

  const handleClickPostLike = event => {
    if (props.id !== "" && liked === false) {
      db.collection("posts")
        .doc(props.id)
        .collection("postLikes")
        .doc(auth.uid)
        .set({
          uid: auth.uid,
          createTime: firebase.firestore.FieldValue.serverTimestamp()
        });
      likeChange();
    }
  };
  likeChange();
  return (
    <div>
      <span className={classes.likedNumber}>
        {(() => {
          if (props.likeCount !== 0) {
            return props.likeCount;
          }
        })()}
      </span>
      {liked ? (
        <FavoriteIcon className={classes.liked} id={props.id} />
      ) : (
        <FavoriteIcon
          className={classes.like}
          onClick={handleClickPostLike}
          id={props.id}
        />
      )}
    </div>
  );
}

function CommentLike(props) {
  const classes = useStyles();
  const firebase = useFirebase();
  const db = firebase.firestore();
  const auth = useSelector(state => state.firebase.auth);
  firebase.firestore();
  const [liked, setLiked] = React.useState("");
  const likeChange = () => {
    if (props.id !== "") {
      db.collection("posts")
        .doc(props.postId)
        .collection("comments")
        .doc(props.id)
        .collection("commentLikes")
        .doc(auth.uid)
        .get()
        .then(function(doc) {
          if (doc.exists) {
            setLiked(true);
          } else {
            setLiked(false);
          }
        })
        .catch(function(error) {
          console.log("Error getting document:", error);
        });
    }
  };
  const handleClickCommentLike = event => {
    if (props.id !== "" && liked === false) {
      db.collection("posts")
        .doc(props.postId)
        .collection("comments")
        .doc(props.id)
        .collection("commentLikes")
        .doc(auth.uid)
        .set({
          uid: auth.uid,
          createTime: firebase.firestore.FieldValue.serverTimestamp()
        });
      likeChange();
    }
  };
  likeChange();
  return (
    <div>
      <span className={classes.likedNumber}>
        {(() => {
          if (props.likeCount !== 0) {
            return props.likeCount;
          }
        })()}
      </span>
      {liked ? (
        <FavoriteIcon
          className={classes.liked}
          id={props.id}
          style={{ marginRigh: 20 }}
        />
      ) : (
        <FavoriteIcon
          className={classes.like}
          onClick={handleClickCommentLike}
          id={props.id}
          style={{ marginRight: 30 }}
        />
      )}
    </div>
  );
}

function CommentList(props) {
  const classes = useStyles();
  const firebase = useFirebase();
  const db = firebase.firestore();
  const auth = useSelector(state => state.firebase.auth);
  firebase.firestore();
  useFirestoreConnect([
    {
      collection: "posts",
      orderBy: ["createTime", "desc"],
      doc: props.id,
      subcollections: [{ collection: "comments" }],
      storeAs: `comments-${props.id}`
    }
  ]);

  const comments = useSelector(
    state => state.firestore.ordered[`comments-${props.id}`]
  );
  const [CommentDeleteId, setCommentDeleteId] = React.useState("");
  const [OpenDelete, setOpenDelete] = React.useState(false);
  const handleClickOpenDelete = event => {
    setCommentDeleteId(event.currentTarget.id);
    setOpenDelete(true);
  };
  const handleCloseDelete = () => {
    setCommentDeleteId("");
    setOpenDelete(false);
  };

  const commentDelete = () => {
    if (
      CommentDeleteId !== "" &&
      !isEmpty(CommentDeleteId) &&
      !isEmpty(CommentDeleteId)
    ) {
      db.collection("posts")
        .doc(props.id)
        .collection("comments")
        .doc(CommentDeleteId)
        .delete()
        .then(function() {
          console.log("Document successfully deleted!");
        })
        .catch(function(error) {
          console.error("Error removing document: ", error);
        });
      setCommentDeleteId("");
      setOpenDelete(false);
    }
  };
  return (
    <div>
      {!isLoaded(comments) ? (
        <span></span>
      ) : isEmpty(comments) ? (
        <span></span>
      ) : (
        comments.map(comment => (
          <Grid container spacing={3} style={{ marginBottom: 30 }}>
            <Grid item xs={2}>
              <Avatar
                alt="profile image"
                src={`${comment.avatar}`}
                className={classes.middle}
              />
            </Grid>
            <Grid item xs={10}>
              <div
                style={{
                  backgroundColor: "#f2f3f5",
                  borderRadius: 10,
                  padding: 15
                }}
              >
                <Link href={`user/${comment.username}`}>
                  <Typography
                    variant="subtitle2"
                    component="subtitle2"
                    gutterBottom
                    style={{ fontWeight: "bold" }}
                  >
                    {comment.displayName
                      ? comment.displayName
                      : comment.username}
                  </Typography>
                </Link>
                <Typography
                  variant="body2"
                  component="body2"
                  gutterBottom
                  style={{ paddingLeft: 20 }}
                >
                  {comment.createTime ? (
                    dateDisplay(comment.createTime)
                  ) : (
                    <div></div>
                  )}
                </Typography>
                <div style={{ paddingTop: 10, paddingBottom: 10 }}>
                  <Typography
                    variant="body2"
                    component="body2"
                    gutterBottom
                    style={{ whiteSpace: "pre-line" }}
                  >
                    {comment.content}
                  </Typography>
                </div>
              </div>
              <div className={classes.commentButtons}>
                <CommentLike
                  postId={props.id}
                  id={comment.id}
                  likeCount={comment.likeCount}
                />
                {(() => {
                  if (auth.uid === comment.uid) {
                    return (
                      <DeleteOutline
                        className={classes.delete}
                        onClick={handleClickOpenDelete}
                        id={comment.id}
                      />
                    );
                  }
                })()}
              </div>
            </Grid>
          </Grid>
        ))
      )}
      <Dialog
        open={OpenDelete}
        onClose={handleCloseDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            投稿を削除してよろしいですか？
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete} color="primary">
            戻る
          </Button>
          <Button onClick={commentDelete} color="primary" autoFocus>
            削除する
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default function TopPage() {
  const fileInput = useRef(null);
  const firebase = useFirebase();
  const db = firebase.firestore();
  firebase.firestore();
  let msg = "";
  useFirestoreConnect([
    {
      collection: "posts",
      orderBy: ["createTime", "desc"]
      /*doc: "22FLerB14AnMY2QfdwlA",
      subcollections: [{ collection: "comments" }]*/
    } // or 'todos'
  ]);
  const posts = useSelector(state => state.firestore.ordered.posts);
  const auth = useSelector(state => state.firebase.auth);
  const profile = useSelector(state => state.firebase.profile);
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

  const [PostDeleteId, setPostDeleteId] = React.useState("");
  const [OpenDelete, setOpenDelete] = React.useState(false);
  const handleClickOpenDelete = event => {
    setPostDeleteId(event.currentTarget.id);
    setOpenDelete(true);
  };
  const handleCloseDelete = () => {
    setPostDeleteId("");
    setOpenDelete(false);
  };

  const postDelete = () => {
    if (PostDeleteId != "") {
      db.collection("posts")
        .doc(PostDeleteId)
        .delete()
        .then(function() {
          console.log("Document successfully deleted!");
        })
        .catch(function(error) {
          console.error("Error removing document: ", error);
        });
      setPostDeleteId("");
      setOpenDelete(false);
    }
  };

  const handleContentSubmit = () => {
    if (content !== "") {
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

        const fileRef = storageRef
          .child(imageRef)
          .put(postImage)
          .then(snapshot => {
            const uploadedPath = `${filePre}-${fileName}`;
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
                  setPostMsg("");
                });
            }, 5000);
          })
          .catch(error => {
            setPosted(true);
            setPostImage("");
            setPostMsg("10MB以下の画像をお願いします。");
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
        setPostMsg("");
        setPostImage("");
      }
    }
  };

  const [commentOpen, setCommentOpen] = React.useState(false);
  const [addCommentId, setAddCommentId] = React.useState("");
  const [commentContent, setCommentContent] = useState("");

  const handleClickCommentOpen = event => {
    setAddCommentId(event.currentTarget.id);
    setCommentOpen(true);
  };

  const handleCommentContentChange = event => {
    setCommentContent(event.target.value);
    console.log(addCommentId);
  };

  const handleCommentClose = () => {
    console.log("close");
    setAddCommentId("");
    setCommentContent("");
    setCommentOpen(false);
  };

  const handleCommentContentSubmit = () => {
    if (
      !isEmpty(addCommentId) &&
      isLoaded(addCommentId) &&
      addCommentId !== "" &&
      commentContent !== ""
    ) {
      db.collection("posts")
        .doc(addCommentId)
        .collection("comments")
        .add({
          uid: auth.uid,
          avatar: profile.avatar,
          displayName: profile.displayName,
          username: profile.username,
          content: commentContent,
          createTime: firebase.firestore.FieldValue.serverTimestamp(),
          likeCount: 0
        });
      setCommentContent("");
      setCommentOpen(false);
    }
  };

  return (
    <div className={classes.root}>
      <Container component="main" maxWidth="sm">
        <Card
          className={classes.card}
          variant="outlined"
          style={{ marginBottom: 30 }}
        >
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs="2">
                <Avatar
                  alt="profile image"
                  src={`${profile.avatar}`}
                  className={classes.middle}
                  style={{ marginTop: 30 }}
                />
              </Grid>
              <Grid item xs="10" style={{ marginTop: 20 }}>
                <TextField
                  id="standard-basic"
                  label="投稿"
                  fullWidth
                  multiline={true}
                  rows={1}
                  rowsMax={5}
                  onChange={handleContentChange}
                  value={content}
                />
                <div>
                  <Grid container spacing={3}>
                    <Grid
                      item
                      xs="8"
                      sm="6"
                      style={{ marginTop: 20 }}
                      onClick={handleImageClick}
                    >
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
                        {postImage.name}
                        {postMsg}
                      </span>
                    </Grid>
                    <Grid
                      item
                      xs="4"
                      sm="6"
                      style={{ marginTop: 20, textAlign: "right" }}
                    >
                      {posted ? (
                        <Button
                          type="button"
                          variant="contained"
                          color="primary"
                          onClick={handleContentSubmit}
                        >
                          投稿
                        </Button>
                      ) : (
                        <CircularProgress />
                      )}
                    </Grid>
                  </Grid>
                </div>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {!isLoaded(posts) ? (
          <div></div>
        ) : isEmpty(posts) ? (
          <div></div>
        ) : (
          posts.map(post => (
            <Grow in={true} timeout={{ enter: 1000 }}>
              <Card
                className={classes.card}
                variant="outlined"
                style={{ marginBottom: 10 }}
              >
                <CardContent>
                  <Grid container spacing={0}>
                    <Grid item xs="2">
                      <Avatar
                        alt="profile image"
                        src={`${post.avatar}`}
                        className={classes.middle}
                      />
                    </Grid>
                    <Grid item xs="10">
                      <Grid container>
                        <Grid item xs="12">
                          <Link href={`user/${post.username}`}>
                            <Typography
                              variant="h6"
                              component="h6"
                              gutterBottom
                              style={{ fontWeight: "bold", margin: 0 }}
                            >
                              {post.displayName
                                ? post.displayName
                                : post.username}
                            </Typography>
                          </Link>
                          <Typography
                            variant="body2"
                            component="body2"
                            gutterBottom
                            style={{}}
                          >
                            {post.createTime ? (
                              dateDisplay(post.createTime)
                            ) : (
                              <div></div>
                            )}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs="12">
                      <div style={{ paddingTop: 10, paddingBottom: 20 }}>
                        <Typography
                          variant="body1"
                          component="body1"
                          gutterBottom
                          style={{ whiteSpace: "pre-line" }}
                        >
                          {post.content}
                        </Typography>
                      </div>
                      {post.postImage ? (
                        <CardMedia
                          style={{ paddingTop: 10 }}
                          className="media"
                          component="img"
                          image={post.postImage}
                          title="Paella dish"
                        />
                      ) : (
                        <div></div>
                      )}
                      <div className={classes.postButtons}>
                        <Comment
                          className={classes.comment}
                          onClick={handleClickCommentOpen}
                          id={post.id}
                        />
                        <PostLike id={post.id} likeCount={post.likeCount} />

                        {(() => {
                          if (auth.uid === post.uid) {
                            return (
                              <DeleteOutline
                                className={classes.delete}
                                onClick={handleClickOpenDelete}
                                id={post.id}
                              />
                            );
                          }
                        })()}
                      </div>
                    </Grid>
                  </Grid>
                  <CommentList id={post.id} />
                </CardContent>
              </Card>
            </Grow>
          ))
        )}
        <Dialog
          open={OpenDelete}
          onClose={handleCloseDelete}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              投稿を削除してよろしいですか？
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDelete} color="primary">
              戻る
            </Button>
            <Button onClick={postDelete} color="primary" autoFocus>
              削除する
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={commentOpen}
          onClose={handleCommentClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogContent style={{ width: "500px" }}>
            <TextField
              autoFocus
              margin="dense"
              label="コメント"
              type="text"
              fullWidth
              multiline={true}
              rows={1}
              rowsMax={5}
              onChange={handleCommentContentChange}
              value={commentContent}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCommentClose} color="primary">
              戻る
            </Button>
            <Button onClick={handleCommentContentSubmit} color="primary">
              投稿
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </div>
  );
}
