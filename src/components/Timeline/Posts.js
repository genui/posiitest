import React, { useEffect, useState } from "react";
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
import Snackbar from "@material-ui/core/Snackbar";
import CircularProgress from "@material-ui/core/CircularProgress";
import axios from "axios";
import MediaQuery from "react-responsive";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";

import ReportProblemIcon from "@material-ui/icons/ReportProblem";

import Linkify from "material-ui-linkify";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  media: {
    height: 0,
    paddingTop: "56.25%",
    "&:hover": {
      cursor: "pointer",
      opacity: 0.5,
    },
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  avatar: {},
  like: {
    "&:hover": {
      cursor: "pointer",
      opacity: 0.5,
    },
  },
  liked: {
    color: "#00E4E8",
  },
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
  const auth = useSelector((state) => state.firebase.auth);
  firebase.firestore();
  const [liked, setLiked] = useState("");
  const likeChange = () => {
    if (props.id !== "") {
      db.collection("timeline")
        .doc('timelineDoc')
        .collection("posts")
        .doc(props.id)
        .collection("postLikes")
        .doc(auth.uid)
        .get()
        .then(function (doc) {
          if (doc.exists) {
            setLiked(true);
          } else {
            setLiked(false);
          }
        })
        .catch(function (error) {
          console.log("Error getting document:", error);
        });
    } 
    
  };

  const handleClickPostLike = (event) => {
    if (props.id !== "" && liked === false) {
      db.collection("timeline")
        .doc("timelineDoc")
        .collection("posts")
        .doc(props.id)
        .collection("postLikes")
        .doc(auth.uid)
        .set({
          uid: auth.uid,
          createTime: firebase.firestore.FieldValue.serverTimestamp(),
        });
      likeChange();
    }
  };
  likeChange();
  return (
    <div>
      {liked ? (
        <Badge badgeContent={props.likeCount} color="error">
          <FavoriteIcon color='primary' id={props.id} />
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
  const auth = useSelector((state) => state.firebase.auth);
  const heic2any = require("heic2any");

  const [PostDeleteId, setPostDeleteId] = useState("");
  const [OpenDelete, setOpenDelete] = useState(false);
  const [PostReportId, setPostReportId] = useState("");
  const [OpenReport, setOpenReport] = useState(false);
  const [openSnack, setOpenSnack] = useState(false);
  const [snackMsg, setSnackMsg] = useState(false);
  const [lightBox, setLightbox] = useState(false);

  const handleSnackClose = () => {
    setOpenSnack(false);
  };

  const handleClickOpenDelete = (event) => {
    setPostDeleteId(event.currentTarget.id);
    setOpenDelete(true);
  };
  const handleCloseDelete = () => {
    setPostDeleteId("");
    setOpenDelete(false);
  };

  const postDelete = () => {
    if (PostDeleteId !== "") {
      db.collection("timeline")
        .doc("timelineDoc")
        .collection("posts")
        .doc(PostDeleteId)
        .delete()
        .then(function () {
          setSnackMsg("投稿を削除しました。");
          setOpenSnack(true);
        })
        .catch(function (error) {
          console.error("Error removing document: ", error);
        });
      setPostDeleteId("");
      setOpenDelete(false);
    }
  };

  const handleClickOpenReport = (event) => {
    setPostReportId(event.currentTarget.id);
    setOpenReport(true);
  };
  const handleCloseReport = () => {
    setPostReportId("");
    setOpenReport(false);
  };

  const postReport = () => {
    if (PostReportId !== "") {
      db.collection("reports")
        .add({
          uid: auth.uid,
          communityId: props.communityId,
          postId: props.id,
          content: props.content,
          type: "communityPost",
          createTime: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then(function () {
          setSnackMsg("通報しました。");
          setOpenSnack(true);
        })
        .catch(function (error) {
          console.error("Error removing document: ", error);
        });
      setPostReportId("");
      setOpenReport(false);
    }
  };

  const [posted, setPosted] = useState(true);
  const [commentOpen, setCommentOpen] = React.useState(false);
  const [addCommentId, setAddCommentId] = React.useState("");
  const [commentContent, setCommentContent] = React.useState("");
  const profile = useSelector((state) => state.firebase.profile);

  const handleClickCommentOpen = (event) => {
    setAddCommentId(event.currentTarget.id);
    setCommentOpen(true);
  };

  const handleCommentContentChange = (event) => {
    setCommentContent(event.target.value);
  };

  const handleCommentClose = () => {
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
      setPosted(false);
      const params = { text: commentContent };
      const url = "https://myflaskapi1234321.herokuapp.com/";
      axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";

      axios.get(url, { params }).then((results) => {
        db.collection("timeline")
          .doc("timelineDoc")
          .collection("posts")
          .doc(addCommentId)
          .collection("comments")
          .add({
            uid: auth.uid,
            avatar: profile.avatar,
            displayName: profile.displayName,
            username: profile.username,
            content: commentContent,
            createTime: firebase.firestore.FieldValue.serverTimestamp(),
            likeCount: 0,
          });
        setCommentContent("");
        setPosted(true);
        setCommentOpen(false);
        setSnackMsg("ポジティブなコメントありがとうございます。");
        setOpenSnack(true);
      });
    }
  };

  return (
    <div>
      {lightBox && (
        <Lightbox
          mainSrc={props.postImage}
          onCloseRequest={() => setLightbox(false)}
        />
      )}
      <Card className={classes.card} style={{ marginBottom: 20 }}>
      <Link to={{ 
        pathname: `/user/${props.uid}`, 
        state: { userid: props.uid}
         }}
         style={{ textDecoration: 'none',color: 'black'}}
         >

        <CardHeader
          avatar={
            <Avatar
              aria-label="recipe"
              src={props.avatar}
              className={classes.avatar}
            />
          }
          title={props.displayName}
          subheader={props.createTime && dateDisplay(props.createTime)}
        />
        </Link>
        <CardContent>
          <Linkify>
            <Typography
              variant="body2"
              component="p"
              style={{ whiteSpace: "pre-line" }}
            >
              {props.content}
            </Typography>
          </Linkify>
        </CardContent>
        {props.postImage && (
          <CardMedia
            className={classes.media}
            image={props.postImage}
            onClick={() => setLightbox(true)}
          />
        )}
        <CardActions disableSpacing>
          <IconButton aria-label="add to favorites">
            <PostLike
              id={props.id}
              communityId={props.communityId}
              likeCount={props.likeCount}
            />
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
          <IconButton aria-label="share">
            <ReportProblemIcon onClick={handleClickOpenReport} id={props.id} />
          </IconButton>
        </CardActions>
        <Comments id={props.id} communityId={props.communityId} />
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
        open={OpenReport}
        onClose={handleCloseReport}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            通報してよろしいですか？
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReport} color="primary">
            戻る
          </Button>
          <Button onClick={postReport} color="primary" autoFocus>
            通報する
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={commentOpen}
        onClose={handleCommentClose}
        aria-labelledby="form-dialog-title"
      >
        <MediaQuery query="(max-width: 499px)">
          <DialogContent style={{ width: "350px" }}>
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
              style={{ width: "265px" }}
            />
          </DialogContent>
        </MediaQuery>

        <MediaQuery query="(min-width: 500px)">
          <DialogContent style={{ width: "459px" }}>
            <TextField
            　color="primary"
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
        </MediaQuery>

        <DialogActions>
          <Button onClick={handleCommentClose} color="primary">
            戻る
          </Button>
          {posted ? (
            <Button onClick={handleCommentContentSubmit} color="primary">
              投稿
            </Button>
          ) : (
            <Button color="secodary">
              投稿中 <CircularProgress size={15} />
            </Button>
          )}
        </DialogActions>
      </Dialog>

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
}
