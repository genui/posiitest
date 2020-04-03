import React from "react";
import { Link } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import logo from "../../images/logo.png";
import SignInMenu from "./SignInMenu";
import SignedInMenu from "./SignedInMenu";
import { isLoaded } from "react-redux-firebase";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";

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

function Header() {
  const auth = useSelector(state => state.firebase.auth);
  let links = "";
  if (isLoaded(auth)) {
    links = auth.uid ? <SignedInMenu /> : <SignInMenu />;
  }
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <AppBar
        position="static"
        color="primary"
        style={{ backgroundColor: "#FFF", borderBottom: "solid 5px #fa9200" }}
      >
        <Toolbar>
          <Typography variant="title" color="inherit" className={classes.flex}>
            <Link to="/" className={classes.link}>
              <img src={logo} style={{ height: 40 }} alt="POSII" />
            </Link>
          </Typography>
          {links}
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default Header;
