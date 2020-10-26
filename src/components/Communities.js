import React, { useState } from "react";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";
import { useFirebase, useFirestoreConnect } from "react-redux-firebase";
import { useSelector } from "react-redux";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import CardActions from "@material-ui/core/CardActions";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Snackbar from "@material-ui/core/Snackbar";
import Linkify from "material-ui-linkify";

const useStyles = makeStyles({
  paper: {
    marginTop: 20,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {},
  form: {
    width: "100%",
  },
  submit: {
    marginTop: 30,
    marginBottom: 20,
  },
  media: {
    height: 200,
  },
  snackbar: {
    backgroundColor: "#fa9200",
  },
});

export default function Communities() {
  const firebase = useFirebase();
  const db = firebase.firestore();
  const auth = useSelector((state) => state.firebase.auth);
  useFirestoreConnect([
    {
      collection: "communities",
      orderBy: ["updateTime", "desc"],
    },
  ]);

  const [communityDeleteId, setCommunityDeleteId] = useState("");
  const [OpenDelete, setOpenDelete] = useState(false);
  const [openSnack, setOpenSnack] = useState(false);
  const [snackMsg, setSnackMsg] = useState(false);
  const communities = useSelector(
    (state) => state.firestore.ordered.communities
  );

  const handleClickOpenDelete = (event) => {
    setCommunityDeleteId(event.currentTarget.id);
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setCommunityDeleteId("");
    setOpenDelete(false);
  };

  const communityDelete = () => {
    if (communityDeleteId !== "") {
      db.collection("communities")
        .doc(communityDeleteId)
        .delete()
        .then(function () {
          setSnackMsg("投稿を削除しました。");
          setOpenSnack(true);
        })
        .catch(function (error) {
          console.error("Error removing document: ", error);
        });
      setCommunityDeleteId("");
      setOpenDelete(false);
    }
  };

  const handleSnackClose = () => {
    setOpenSnack(false);
  };


  const classes = useStyles();
  
  const cuse= firebase.auth().currentUser;
  if (cuse != null) {
    const currentuser= firebase.auth().currentUser.uid;
    db.collection('profile').doc(currentuser).get().then(val => {
      if (val.data() === undefined){
        db.collection('users').doc(currentuser).get().then(val => {
          const createNewUserProfile = {
            displayName: val.data().displayName,
            avatar: "",
          }
          db.collection('profile').doc(currentuser).set(createNewUserProfile);
        });
      }
    })

  }

  return (
    <Container component="main" maxWidth="sm">
      <Button
        type="button"
        fullWidth
        variant="contained"
        color="primary"
        className={classes.submit}
        href="/communities/new"
      >
        コミュニティを作成する
      </Button>
      {communities &&
        communities.map((community) => (
          <Card className={classes.root} style={{ marginBottom: 20 }}>
            <Link
              to={`/communities/${community.id}`}
              style={{ textDecoration: "none" }}
            >
              <CardMedia
                className={classes.media}
                image={community.image}
                title="Contemplative Reptile"
                style={{ backgroundColor: "#EEE" }}
              />
            </Link>
            <CardContent>
              <Link
                to={`/communities/${community.id}`}
                style={{ textDecoration: "none" }}
              >
                <Typography
                  gutterBottom
                  variant="h5"
                  component="h2"
                  style={{ color: "#000" }}
                >
                  {community.name}{" "}
                  <span style={{ fontSize: 15 }}>
                    {!community.public && " 非公開"}
                  </span>
                </Typography>
                <Linkify>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                    style={{ whiteSpace: "pre-line" }}
                  >
                    {community.text}
                  </Typography>
                </Linkify>
              </Link>
            </CardContent>
            {(() => {
              if (community.uid === auth.uid) {
                return (
                  <CardActions style={{ margin: 0 }} disableSpacing>
                    <IconButton
                      onClick=""
                      id=""
                      href={`/communities/edit/${community.id}`}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={handleClickOpenDelete}
                      id={community.id}
                    >
                      <DeleteOutline />
                    </IconButton>
                  </CardActions>
                );
              }
            })()}
          </Card>
        ))}
      <Dialog
        open={OpenDelete}
        onClose={handleCloseDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            コミュニティを削除してよろしいですか？
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete} color="primary">
            戻る
          </Button>
          <Button onClick={communityDelete} color="primary" autoFocus>
            削除する
          </Button>
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
    </Container>
  );
}
