import React, { userState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useFirebase, isLoaded, isEmpty } from "react-redux-firebase";
import { useSelector } from "react-redux";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { red } from "@material-ui/core/colors";
import FavoriteIcon from "@material-ui/icons/Favorite";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Comment from "@material-ui/icons/Comment";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

import Badge from "@material-ui/core/Badge";

import Comments from "./Comments";

const useStyles = makeStyles(theme => ({
  media: {
    height: 0,
    paddingTop: "56.25%" // 16:9
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: "rotate(180deg)"
  },
  avatar: {
    backgroundColor: "#EEE"
  },
  like: {
    "&:hover": {
      cursor: "pointer",
      opacity: 0.5
    }
  },
  liked: {
    color: "#fa9200"
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
      {liked ? (
        <Badge badgeContent={props.likeCount} color="error">
          <FavoriteIcon className={classes.liked} id={props.id} />
        </Badge>
      ) : (
        <Badge badgeContent={props.likeCount} color="error">
          <FavoriteIcon
            className={classes.like}
            onClick={handleClickPostLike}
            id={props.id}
          />
        </Badge>
      )}
    </div>
  );
}

export default function Posts(props) {
  const classes = useStyles();
  const firebase = useFirebase();
  const db = firebase.firestore();
  const auth = useSelector(state => state.firebase.auth);

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

  const [commentOpen, setCommentOpen] = React.useState(false);
  const [addCommentId, setAddCommentId] = React.useState("");
  const [commentContent, setCommentContent] = React.useState("");
  const profile = useSelector(state => state.firebase.profile);

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
    <div>
      <Card className={classes.card} style={{ marginBottom: 20 }}>
        <CardHeader
          avatar={
            <Avatar
              aria-label="recipe"
              className={classes.avatar}
              src={props.avatar}
            >
              #
            </Avatar>
          }
          title={props.displayName}
          subheader={props.createTime && dateDisplay(props.createTime)}
        />
        <CardContent>
          <Typography variant="body2" component="p">
            {props.content}
          </Typography>
        </CardContent>
        {props.postImage && (
          <CardMedia className={classes.media} image={props.postImage} />
        )}
        <CardActions disableSpacing>
          <IconButton aria-label="add to favorites">
            <PostLike id={props.id} likeCount={props.likeCount} />
          </IconButton>
          <IconButton aria-label="share">
            <Comment onClick={handleClickCommentOpen} id={props.id} />
          </IconButton>
          {(() => {
            if (auth.uid === props.uid) {
              return (
                <IconButton
                  aria-label="share"
                  onClick={handleClickOpenDelete}
                  id={props.id}
                >
                  <DeleteOutline />
                </IconButton>
              );
            }
          })()}
        </CardActions>
        <Comments id={props.id} />
      </Card>

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
    </div>
  );
}
