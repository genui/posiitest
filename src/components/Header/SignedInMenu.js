import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { useFirebase } from "react-redux-firebase";
import { useSelector } from "react-redux";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Avatar from "@material-ui/core/Avatar";
import Grow from "@material-ui/core/Grow";
import { Link } from "react-router-dom";

const useStyles = makeStyles({
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
  }
});

export default function SignedInMenu() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState("");
  const [profilePicUrl, setProfilePicUrl] = useState("");
  const firebase = useFirebase();
  const profile = useSelector(state => state.firebase.profile);
  const handleSignOut = () => {
    firebase.logout();
  };
  const handleClick = event => {
    // #3
    setAnchorEl(event.currentTarget);
    //this.setState({ anchorEl: event.currentTarget });
  };

  const handleClose = () => {
    setAnchorEl(null);
    // this.setState({ anchorEl: null });
  };
  return (
    <Grow in={true} timeout={{ enter: 1000, exit: 1000 }}>
      <React.Fragment>
        <Button
          color="inherit"
          aria-haspopup="true"
          onClick={handleClick}
          className={classes.noTransform}
        >
          <Avatar
            alt="profile image"
            src={`${profile.avatar}`}
            className={classes.avatar}
          />
        </Button>
        <Menu
          id="user-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem className={classes.menuItem}>
            <Link to="/profile_edit" className={classes.link}>
              プロフィール編集
            </Link>
          </MenuItem>
          <MenuItem className={classes.menuItem} onClick={handleSignOut}>
            ログアウト
          </MenuItem>
        </Menu>
      </React.Fragment>
    </Grow>
  );
}
