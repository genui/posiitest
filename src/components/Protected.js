import React from "react";
import { useFirebase } from "react-redux-firebase";

export default function Protected() {
  const firebase = useFirebase();
  const handleSignOut = () => {
    firebase.logout();
  };
  console.log("protected");
  return <button onClick={handleSignOut}>ログアウト</button>;
}
