import React, { useState } from "react";
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
import CardContent from "@material-ui/core/CardContent";
import { AddAPhoto } from "@material-ui/icons";
import { isLoaded, isEmpty } from "react-redux-firebase";
import Link from "@material-ui/core/Link";

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: "#f5f5f5",
    flexGrow: 1,
    minHeight: 500,
    paddingTop: 30
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
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7)
  },
  camera: {
    "&:hover": {
      cursor: "pointer",
      opacity: 0.5
    }
  }
}));

function dateDisplay(date) {
  const dt = date.toDate();
  const year = dt.getFullYear();
  const month = dt.getMonth() + 1;
  const day = dt.getDate();
  return `${year}年${month}月${day}日`;
}

export default function TopPage() {
  const firebase = useFirebase();
  const db = firebase.firestore();
  firebase.firestore();
  useFirestoreConnect([
    { collection: "posts", orderBy: ["created_at", "desc"] } // or 'todos'
  ]);
  const posts = useSelector(state => state.firestore.ordered.posts);
  const auth = useSelector(state => state.firebase.auth);
  const profile = useSelector(state => state.firebase.profile);
  const [content, setContent] = useState("");
  const classes = useStyles();

  const handleContentChange = event => {
    setContent(event.target.value);
  };

  const handleContentSubmit = () => {
    db.collection("posts").add({
      uid: auth.uid,
      avatar: profile.avatar,
      displayName: profile.displayName,
      username: profile.username,
      content: content,
      created_at: firebase.firestore.FieldValue.serverTimestamp()
    });
    console.log("submit");
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
                  className={classes.large}
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
                />
                <div>
                  <Grid container spacing={3}>
                    <Grid item xs="9" style={{ marginTop: 20 }}>
                      <AddAPhoto className={classes.camera} />
                    </Grid>
                    <Grid
                      item
                      xs="3"
                      style={{ marginTop: 20, textAlign: "right" }}
                    >
                      <Button
                        type="button"
                        variant="contained"
                        color="primary"
                        onClick={handleContentSubmit}
                      >
                        投稿
                      </Button>
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
            <Card className={classes.card} variant="outlined">
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs="2">
                    <Avatar
                      alt="profile image"
                      src={`${post.avatar}`}
                      className={classes.large}
                    />
                  </Grid>
                  <Grid item xs="10">
                    <Link href={`user/${post.username}`}>
                      <Typography
                        variant="subtitle2"
                        component="subtitle2"
                        gutterBottom
                        style={{ fontWeight: "bold" }}
                      >
                        {post.displayName ? post.displayName : post.username}
                      </Typography>
                    </Link>
                    <Typography
                      variant="body2"
                      component="body2"
                      gutterBottom
                      style={{ paddingLeft: 20 }}
                    >
                      {post.created_at ? (
                        dateDisplay(post.created_at)
                      ) : (
                        <div></div>
                      )}
                    </Typography>
                    <div style={{ paddingTop: 20 }}>
                      <Typography
                        variant="body2"
                        component="body2"
                        gutterBottom
                        style={{ whiteSpace: "pre-line" }}
                      >
                        {post.content}
                      </Typography>
                    </div>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))
        )}
      </Container>
    </div>
  );
}
