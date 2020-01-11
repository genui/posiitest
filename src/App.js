import React from "react";
import { Provider } from "react-redux";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/firestore";
import "firebase/storage";
import {
  ReactReduxFirebaseProvider,
  isLoaded,
  isEmpty
} from "react-redux-firebase";
import { createFirestoreInstance } from "redux-firestore";
import { useSelector } from "react-redux";
import configureStore from "./store";
import { firebase as fbConfig, reduxFirebase as rfConfig } from "./config";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import PasswordReminder from "./components/PasswordReminder";
import ProfileEdit from "./components/ProfileEdit";
import TopPage from "./components/TopPage";
import UserPage from "./components/UserPage";
import UploadTest from "./components/UploadTest";
import Header from "./components/Header";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { theme } from "./materialui/theme";
import { makeStyles } from "@material-ui/core/styles";

const initialState = window && window.__INITIAL_STATE__; // set initial state here
const store = configureStore(initialState);
// Initialize Firebase instance
firebase.initializeApp(fbConfig);
const firestore = firebase.firestore();
firestore.settings({
  timestampsInSnapshots: true
});

firebase.firestore();

function PrivateRoute({ children, ...rest }) {
  const auth = useSelector(state => state.firebase.auth);
  return (
    <Route
      {...rest}
      render={({ location }) =>
        isLoaded(auth) && !isEmpty(auth) ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/signin",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    "& > * + *": {
      marginLeft: theme.spacing(2)
    }
  }
}));

function AuthIsLoaded({ children }) {
  const classes = useStyles();
  const auth = useSelector(state => state.firebase.auth);
  if (!isLoaded(auth))
    return (
      <div>
        <MuiThemeProvider theme={theme}>
          <Header />
        </MuiThemeProvider>
      </div>
    );
  return children;
}

function App() {
  return (
    <Provider store={store}>
      <ReactReduxFirebaseProvider
        firebase={firebase}
        config={rfConfig}
        dispatch={store.dispatch}
        createFirestoreInstance={createFirestoreInstance}
      >
        <BrowserRouter>
          <AuthIsLoaded>
            <MuiThemeProvider theme={theme}>
              <Header />
              <Switch>
                <Route path="/signin" component={SignIn} />
                <Route path="/signup" component={SignUp} />
                <Route path="/password_reminder" component={PasswordReminder} />
                <PrivateRoute exact path="/">
                  <TopPage />
                </PrivateRoute>
                <PrivateRoute path="/profile_edit">
                  <ProfileEdit />
                </PrivateRoute>
                <PrivateRoute path="/upload">
                  <UploadTest />
                </PrivateRoute>
                <PrivateRoute path="/user/:username">
                  <UserPage />
                </PrivateRoute>
              </Switch>
            </MuiThemeProvider>
          </AuthIsLoaded>
        </BrowserRouter>
      </ReactReduxFirebaseProvider>
    </Provider>
  );
}

export default App;
