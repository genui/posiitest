import React from "react";
import { Provider } from "react-redux";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/firestore"; // make sure you add this for firestore
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
import PasswordReminder from "./components/PasswordReminder";
import Protected from "./components/Protected";
import Header from "./components/Header";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { theme } from "./materialui/theme";

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
  console.log(auth);
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
          <MuiThemeProvider theme={theme}>
            <Header />
            <Switch>
              <Route path="/signin" component={SignIn} />
              <Route path="/password_reminder" component={PasswordReminder} />
              <PrivateRoute path="/protected">
                <Protected />
              </PrivateRoute>
            </Switch>
          </MuiThemeProvider>
        </BrowserRouter>
      </ReactReduxFirebaseProvider>
    </Provider>
  );
}

export default App;
