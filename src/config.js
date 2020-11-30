// // 本番環境
// export const firebase = {
//   apiKey: "AIzaSyAGJYOgpwcDI-1XlRN16l-FJtnJbDmAcUk",
//   authDomain: "posiidev.firebaseapp.com",
//   databaseURL: "https://posiidev.firebaseio.com",
//   projectId: "posiidev",
//   storageBucket: "posiidev.appspot.com",
//   messagingSenderId: "617046991056",
//   appId: "1:617046991056:web:c0af23367808d87bf1bed5",
//   measurementId: "G-8FFYJ89XR2"
// };

// // 検証環境（無料枠を超えてしまったようで、動きが少し鈍い感じがします。）
export const firebase = {
  apiKey: "AIzaSyAGJYOgpwcDI-1XlRN16l-FJtnJbDmAcUk",
  authDomain: "posiidev.firebaseapp.com",
  databaseURL: "https://posiidev.firebaseio.com",
  projectId: "posiidev",
  storageBucket: "posiidev.appspot.com",
  messagingSenderId: "617046991056",
  appId: "1:617046991056:web:c0af23367808d87bf1bed5",
  measurementId: "G-8FFYJ89XR2"
};

export const reduxFirebase = {
  userProfile: "users",
  useFirestoreForProfile: true,
  enableLogging: false
};

export default { firebase, reduxFirebase };
