import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import Grow from "@material-ui/core/Grow";

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

export default function SignInMenu() {
  const classes = useStyles();
  return (
    <Grow in={true} timeout={{ enter: 1000 }}>
      <div>
        <Button className={classes.button}>
          <Link to="/signin" className={classes.link}>
            ログイン
          </Link>
        </Button>
        <Button className={classes.button}>
          <Link to="/signup" className={classes.link}>
            登録
          </Link>
        </Button>
      </div>
    </Grow>
  );
}
