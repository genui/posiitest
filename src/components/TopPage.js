import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useFirebase } from "react-redux-firebase";
import { useSelector } from "react-redux";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import { CropOriginal } from "@material-ui/icons";

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
        <Card className={classes.card} variant="outlined">
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs="2">
                <Avatar
                  alt="profile image"
                  src={`${profile.avatar}`}
                  className={classes.large}
                />
              </Grid>
              <Grid item xs="10" style={{ marginTop: 20 }}>
                <TextField
                  id="standard-basic"
                  label="投稿しよう"
                  fullWidth
                  multiline={true}
                  rows={1}
                  rowsMax={5}
                />
                <div>
                  <CropOriginal />
                  <Button variant="contained" color="primary">
                    投稿する
                  </Button>
                </div>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
}
