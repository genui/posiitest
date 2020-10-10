import React from "react";
import { useSelector } from "react-redux";
import posii_1 from "../images/posii_1.jpg";
import posii_2 from "../images/posii_2.jpg";
import posii_3 from "../images/posii_3.jpg";
import posii_4 from "../images/posii_4.jpg";
import posii_5 from "../images/posii_5.jpg";
import posii_6 from "../images/posii_6.jpg";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import { createMuiTheme } from "@material-ui/core/styles";
import { isLoaded } from "react-redux-firebase";
import { Redirect } from "react-router-dom";

export const theme = createMuiTheme({
  palette: {
    primary: {
      light: "#fa9200",
      main: "#fa9200",
      dark: "#fa9200",
      contrastText: "#FFF",
    },
  },
});

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
  flex: {
    flexGrow: 1,
  },
  link: {
    textDecoration: "none",
    color: "white",
  },
  button: {
    color: "white",
  },
});

function Copyright() {
  return (
    <Typography
      variant="body2"
      color="textSecondary"
      align="center"
      style={{ padding: 30 }}
    >
      {"Copyright © "}
      POSII
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

export default function App() {
  const classes = useStyles();
  const auth = useSelector((state) => state.firebase.auth);
  if (isLoaded(auth)) {
    if (auth.uid) {
      return <Redirect to="/communities" />;
    }
  }
  return (
    <div className={classes.root}>
      <Container component="main" maxWidth="md">
        <img src={posii_1} style={{ maxWidth: "100%" }} alt="posii説明" />
        <img src={posii_2} style={{ maxWidth: "100%" }} alt="posii説明" />
        <img src={posii_3} style={{ maxWidth: "100%" }} alt="posii説明" />
        <img src={posii_4} style={{ maxWidth: "100%" }} alt="posii説明" />
        <img src={posii_5} style={{ maxWidth: "100%" }} alt="posii説明" />
        <img src={posii_6} style={{ maxWidth: "100%" }} alt="posii説明" />
        <div style={{ textAlign: "center", padding: 30 }}>
          {/* <Button
            variant="contained"
            color="primary"
            href="https://docs.google.com/forms/d/e/1FAIpQLSe5Ff5V-cmWub6Rh6G_W22BMLD2aL5Ku-CNYPOkAt6-oH8YxA/viewform"
          >
            事前登録はこちら
          </Button> */}
        </div>
      </Container>
      <Copyright />
    </div>
  );
}
