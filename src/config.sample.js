//ファイル名をconfig.jsに変更して、Firebaseから情報を入力してください。
export const firebase = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};

export const reduxFirebase = {
  userProfile: "users",
  useFirestoreForProfile: true,
  enableLogging: false
};

export default { firebase, reduxFirebase };
