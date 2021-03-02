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
import { sampleuser } from "./config";
import { BrowserRouter, Switch, Route, Redirect, Link } from "react-router-dom";
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
import { PinDropSharp } from "@material-ui/icons";
import { useFirebase } from "react-redux-firebase";
import GestCommunities from "./components/GestCommunitiesTimeline/GestCommunities";
import GestCommunitiesTimeline from "./components/GestCommunitiesTimeline";
import GestComments from "./components/GestCommunitiesTimeline/GestComments";
import Timeline from "./components/Timeline/Timline";


const initialState = window && window.__INITIAL_STATE__; // set initial state here
const store = configureStore(initialState);
// Initialize Firebase instance
firebase.initializeApp(fbConfig);
const firestore = firebase.firestore();
firestore.settings({
  timestampsInSnapshots: true,
});
firebase.firestore();
const userData = [
  {
    id: 'walter',
    display: 'Walter White',
  }
]
// メンション用ユーザ情報取得
const db = firebase.firestore();
db.collection("profile")
.get()
.then(user => {
  for (let i = 0; i < user.docs.length; i++) {
    const userId = user.docs[i].id;
    db.collection('profile')
    .doc(userId).get().then(displayName => {
      const displayUserName = displayName.data().displayName;
      userData.unshift({
        id: userId,
        display: displayUserName
      });
    })
  }
})

function PrivateRoute({ children, ...rest }) {
  const auth = useSelector((state) => state.firebase.auth);
  return (
    <Route
      {...rest}
      render={( location ) =>
        isLoaded(auth) ? (
          children
        ) : (
          <Route exact path="/" />
          // <Redirect
          // exact path="/gestcommunities/:communityId"
          // />

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
        <PrivateRoute theme={theme}>
          <Header />
        </PrivateRoute>
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
                <Route exact path="/Timeline/Timeline">
                  <Timeline exact path="/Timeline/Timeline" />
                </Route>
                <Route exact path="/gestcommunities">
                  <GestCommunities exact path="/gestcommunities" />
                </Route>
                <Route exact path="/gestcommunities/:communityId">
                  <GestCommunitiesTimeline  exact path="/gestcommunities/:communityId"/>
                </Route>
                <Route path="/signin" component={SignIn} />
                <Route path="/signup" component={SignUp} />
                <Route path="/password_reminder" component={PasswordReminder} />
                <Route exact path="/">
                  <Lp />
                </Route>
                <PrivateRoute exact path="/notifications">
                  <Notifications />
                </PrivateRoute>
                <Route exact path="/communities">
                  <Communities exact path="/communities" />
                </Route>
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
                <Route exact path="/communities/:communityId">
                  <CommunitiesTimeline exact path="/communities/:communityId" data={userData} />
                </Route>
                <PrivateRoute exact path="/profile_edit">
                  <ProfileEdit />
                </PrivateRoute>
                <PrivateRoute path="/user/:uid" component={UserPage}>
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
