import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { useFirebase } from "react-redux-firebase";

const useStyles = makeStyles({
  root: {
    flexGrow: 1
  },
  flex: {
    flexGrow: 1
  },
  link: {
    textDecoration: "none",
    color: "white"
  },
  button: {
    color: "white"
  }
});

export default function SignedInMenu() {
  const classes = useStyles();
  const firebase = useFirebase();
  const handleSignOut = () => {
    firebase.logout();
  };
  return (
    <div>
      <Button className={classes.button} onClick={handleSignOut}>
        ログアウト
      </Button>
    </div>
  );
}
