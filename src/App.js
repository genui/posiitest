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
  isEmpty,
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
import UserPage from "./components/UserPage";
import Header from "./components/Header";
import Communities from "./components/Communities";
import CommunitiesNew from "./components/CommunitiesNew";
import CommunitiesEdit from "./components/CommunitiesEdit";
import CommunityPostDetail from "./components/CommunityPostDetail";
import CommunitiesTimeline from "./components/CommunitiesTimeline";
import Notifications from "./components/Notifications";
import Lp from "./components/Lp";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { theme } from "./materialui/theme";

const initialState = window && window.__INITIAL_STATE__; // set initial state here
const store = configureStore(initialState);
// Initialize Firebase instance
firebase.initializeApp(fbConfig);
const firestore = firebase.firestore();
firestore.settings({
  timestampsInSnapshots: true,
});

firebase.firestore();

function PrivateRoute({ children, ...rest }) {
  const auth = useSelector((state) => state.firebase.auth);
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
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}

function AuthIsLoaded({ children }) {
  const auth = useSelector((state) => state.firebase.auth);
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
                <Route exact path="/">
                  <Lp />
                </Route>
                <PrivateRoute exact path="/notifications">
                  <Notifications />
                </PrivateRoute>
                <PrivateRoute exact path="/communities">
                  <Communities />
                </PrivateRoute>
                <PrivateRoute
                  exact
                  path="/communities/:communityId/posts/:postId"
                >
                  <CommunityPostDetail />
                </PrivateRoute>
                <PrivateRoute exact path="/communities/new">
                  <CommunitiesNew />
                </PrivateRoute>
                <PrivateRoute exact path="/communities/edit/:communityId">
                  <CommunitiesEdit />
                </PrivateRoute>
                <PrivateRoute exact path="/communities/:communityId">
                  <CommunitiesTimeline />
                </PrivateRoute>
                <PrivateRoute exact path="/profile_edit">
                  <ProfileEdit />
                </PrivateRoute>
                <PrivateRoute path="/user/:username">
                  <UserPage />
                </PrivateRoute>
                <Route
                  render={() => (
                    <h2 style={{ textAlign: "center" }}>
                      ページが存在しません。
                    </h2>
                  )}
                />
              </Switch>
            </MuiThemeProvider>
          </AuthIsLoaded>
        </BrowserRouter>
      </ReactReduxFirebaseProvider>
    </Provider>
  );
}

export default App;
