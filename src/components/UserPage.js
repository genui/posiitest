import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useFirebase } from "react-redux-firebase";
import { useSelector } from "react-redux";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import { getPortPromise } from "portfinder";
import { useParams } from "react-router-dom";
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

export default function UserPage() {
  let { username } = useParams();
  const firebase = useFirebase();
  const db = firebase.firestore();
  const [displayName, setDisplayName] = useState("");
  const [profileText, setProfileText] = useState("");
  const [avatar, setAvatar] = useState("");
  const userInfo = db
    .collection("users")
    .where("username", "==", username)
    .limit(1)
    .get()
    .then(querySnapshot => {
      const items = querySnapshot.docs.map(doc => doc.data());
      setDisplayName(items[0].displayName);
      setProfileText(items[0].profileText);
      setAvatar(items[0].avatar);
    });
  const classes = useStyles();
  const profile = useSelector(state => state.firebase.profile);

  return (
    <div className={classes.root}>
      <Container component="main" maxWidth="sm">
        <Grid container spacing={3}>
          <Grid item xs="2">
            <Avatar
              alt="profile image"
              src={`${avatar}`}
              className={classes.large}
            />
          </Grid>
          <Grid item xs="10" style={{ marginTop: 20 }}>
            <Typography variant="h5" component="h5" gutterBottom>
              {displayName}
            </Typography>
            <Typography
              variant="body2"
              component="body2"
              gutterBottom
              style={{ whiteSpace: "pre-line" }}
            >
              {profileText}
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
