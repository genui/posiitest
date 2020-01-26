import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  useFirebase,
  isLoaded,
  isEmpty,
  useFirestoreConnect
} from "react-redux-firebase";
import { useSelector } from "react-redux";
import Grid from "@material-ui/core/Grid";
import CardActions from "@material-ui/core/CardActions";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import FavoriteIcon from "@material-ui/icons/Favorite";
import DeleteOutline from "@material-ui/icons/DeleteOutline";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Button from "@material-ui/core/Button";

import CardContent from "@material-ui/core/CardContent";

import Badge from "@material-ui/core/Badge";

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
  if (date !== "") {
    const dt = date.toDate();
    const year = dt.getFullYear();
    const month = dt.getMonth() + 1;
    const day = dt.getDate();
    return `${year}年${month}月${day}日`;
  }
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
      {liked ? (
        <Badge badgeContent={props.likeCount} color="error">
          <FavoriteIcon className={classes.liked} id={props.id} />
        </Badge>
      ) : (
        <Badge badgeContent={props.likeCount} color="error">
          <FavoriteIcon
            className={classes.like}
            onClick={handleClickCommentLike}
            id={props.id}
          />
        </Badge>
      )}
    </div>
  );
}

export default function Comments(props) {
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
    if (CommentDeleteId !== "" && !isEmpty(CommentDeleteId)) {
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
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={1}>
                <Avatar alt="profile image" src={`${comment.avatar}`} />
              </Grid>
              <Grid item xs={11}>
                <div
                  style={{
                    backgroundColor: "#f2f3f5",
                    borderRadius: 10,
                    padding: 15,
                    marginLeft: 20
                  }}
                >
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
                  <Typography
                    variant="body2"
                    component="body2"
                    gutterBottom
                    style={{ paddingLeft: 10 }}
                  >
                    {comment.createTime ? (
                      dateDisplay(comment.createTime)
                    ) : (
                      <div></div>
                    )}
                  </Typography>
                  <div style={{ paddingTop: 10 }}>
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
                <CardActions disableSpacing>
                  <IconButton aria-label="add to favorites">
                    <CommentLike
                      postId={props.id}
                      id={comment.id}
                      likeCount={comment.likeCount}
                    />
                  </IconButton>
                  {(() => {
                    if (auth.uid === comment.uid) {
                      return (
                        <IconButton
                          aria-label="delete"
                          onClick={handleClickOpenDelete}
                          id={comment.id}
                        >
                          <DeleteOutline />
                        </IconButton>
                      );
                    }
                  })()}
                </CardActions>
              </Grid>
            </Grid>
          </CardContent>
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
