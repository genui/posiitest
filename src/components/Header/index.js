import React from "react";
import { Link, Redirect } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import logo from "../../images/logo.png";
import SignInMenu from "./SignInMenu";
import SignedInMenu from "./SignedInMenu";
import { isLoaded, isEmpty} from "react-redux-firebase";
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
  const communityId = window.location.href.split('/')[4];
  const auth = useSelector(state => state.firebase.auth);
  let links = "";
  const classes = useStyles();
  links = auth.uid ? <SignedInMenu /> : <SignInMenu />;
  if (isLoaded(auth) && !isEmpty(auth)) {
      return (
        <div className={classes.root}>
          <AppBar
            position="static" 
            color="primary"
            style={{ backgroundColor: "#FFF", borderBottom: "solid 5px #fa9200" }}
          >
            <Toolbar>
              <Typography variant="title" color="inherit" className={classes.flex}>
                <Link to="/communities" className={classes.link}>
                  <img src={logo} style={{ height: 40 }} alt="POSII" />
                </Link>
              </Typography>
              {links}
            </Toolbar>
          </AppBar>
        </div>
      );
  } else {
    if (!communityId){
      return (
        <div className={classes.root}>
        <Redirect to='/gestcommunities' />
        <AppBar
          position="static" 
          color="primary"
          style={{ backgroundColor: "#FFF", borderBottom: "solid 5px #fa9200" }}
          >
          <Toolbar>
            <Typography variant="title" color="inherit" className={classes.flex}>
              <Link to="/gestcommunities" className={classes.link}>
                <img src={logo} style={{ height: 40 }} alt="POSII" />
              </Link>
            </Typography>
            {links}
          </Toolbar>
        </AppBar>
      </div>
      );
    } else {
      return (
        <div className={classes.root}>
        <Redirect to={`/gestcommunities/${communityId}`} />
        <AppBar
          position="static" 
          color="primary"
          style={{ backgroundColor: "#FFF", borderBottom: "solid 5px #fa9200" }}
        >
          <Toolbar>
            <Typography variant="title" color="inherit" className={classes.flex}>
              <Link to="/gestcommunities" className={classes.link}>
                <img src={logo} style={{ height: 40 }} alt="POSII" />
              </Link>
            </Typography>
            {links}
          </Toolbar>
        </AppBar>
      </div>
      );
    }
  }
}

export default Header;

