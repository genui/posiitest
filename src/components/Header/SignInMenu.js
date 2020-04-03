import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import Grow from "@material-ui/core/Grow";
import Dehaze from "@material-ui/icons/Dehaze";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

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
  },
  dehaze: {
    color: "#888"
  }
});

export default function SignInMenu() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState("");
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
          <Dehaze className={classes.dehaze} />
        </Button>
        <Menu
          id="user-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem className={classes.menuItem}>
            <Link to="/signin" className={classes.link}>
              ログイン
            </Link>
          </MenuItem>
          <MenuItem className={classes.menuItem}>
            <Link to="/signup" className={classes.link}>
              新規登録
            </Link>
          </MenuItem>
        </Menu>
      </React.Fragment>
    </Grow>
  );
}
