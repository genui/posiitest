import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useFirebase } from "react-redux-firebase";
import { useSelector } from "react-redux";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
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
    marginTop: 30,
    width: theme.spacing(7),
    height: theme.spacing(7)
  }
}));

export default function TopPage() {
  const firebase = useFirebase();
  const db = firebase.firestore();
  db.collection("users")
    .where("username", "==", "itoyohei")
    .get()
    .then(querySnapshot => {
      const items = querySnapshot.docs.map(doc => doc.data());
      console.log(items);
    });
  const classes = useStyles();
  const profile = useSelector(state => state.firebase.profile);

  console.log("protected");
  return (
    <div className={classes.root}>
      <Container component="main" maxWidth="sm">
        <Grid container spacing={3}>
          <Grid item xs="2">
            <Avatar
              alt="profile image"
              src={`${profile.avatar}`}
              className={classes.large}
            />
          </Grid>
          <Grid item xs="10" style={{ marginTop: 20 }}>
            <Typography variant="h5" component="h5" gutterBottom>
              {profile.username}
            </Typography>
            <Typography
              variant="body2"
              component="body2"
              gutterBottom
              style={{ whiteSpace: "pre-line" }}
            >
              {profile.profileText}
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
