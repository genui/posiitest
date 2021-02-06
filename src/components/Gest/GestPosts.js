import React, { useState } from "react";
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
import GestComments from "./GestComments";
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
    color: "#fa9200",
  },
  snackbar: {
    backgroundColor: "#fa9200",
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

export default function GestPosts(props) {
  const classes = useStyles();
  const firebase = useFirebase();
  const db = firebase.firestore();
  const auth = useSelector((state) => state.firebase.auth);

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
      db.collection("communities")
        .doc(props.communityId)
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
        <GestComments id={props.id} communityId={props.communityId} />
      </Card>



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
