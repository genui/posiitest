// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require("firebase-functions");

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require("firebase-admin");
admin.initializeApp();

const db = admin.firestore();

exports.updateProfileUsername = functions.firestore
  .document("users/{userId}")
  .onUpdate((change, context) => {
    const { userId } = context.params;

    var newUsername = change.after.data().displayName;
    var previousUsername = change.before.data().displayName;

    var newAvatar = change.after.data().avatar;
    var previousAvatar = change.before.data().avatar;

    if (
      newUsername.localeCompare(previousUsername) !== 0 ||
      newAvatar.localeCompare(previousAvatar) !== 0
    ) {
      const postCollectionRef = db.collection("posts");
      const postQuery = postCollectionRef.where("uid", "==", `${userId}`);

      const res1 = postQuery.get().then(querySnapshot => {
        if (querySnapshot.empty) {
          return null;
        } else {
          const promises = [];

          querySnapshot.forEach(doc => {
            promises.push(
              doc.ref.update({
                displayName: `${newUsername}`,
                avatar: `${newAvatar}`
              })
            );
          });

          return Promise.all(promises);
        }
      });

      const commentCollectionRef = db.collectionGroup("comments");
      const commentQuery = commentCollectionRef.where("uid", "==", `${userId}`);

      const res2 = commentQuery.get().then(querySnapshot => {
        if (querySnapshot.empty) {
          return null;
        } else {
          const promises = [];

          querySnapshot.forEach(doc => {
            promises.push(
              doc.ref.update({
                displayName: `${newUsername}`,
                avatar: `${newAvatar}`
              })
            );
          });

          return Promise.all(promises);
        }
      });
      const postGroupCollectionRef = db.collectionGroup("posts");
      const postGroupQuery = postGroupCollectionRef.where(
        "uid",
        "==",
        `${userId}`
      );

      const res3 = postGroupQuery.get().then(querySnapshot => {
        if (querySnapshot.empty) {
          return null;
        } else {
          const promises = [];

          querySnapshot.forEach(doc => {
            promises.push(
              doc.ref.update({
                displayName: `${newUsername}`,
                avatar: `${newAvatar}`
              })
            );
          });

          return Promise.all(promises);
        }
      });

      const notificationQuery = db
        .collectionGroup("notifications")
        .where("uid", "==", `${userId}`);
      const res4 = notificationQuery.get().then(querySnapshot => {
        if (querySnapshot.empty) {
          return null;
        } else {
          const promises = [];
          querySnapshot.forEach(doc => {
            promises.push(
              doc.ref.update({
                displayName: `${newUsername}`,
                avatar: `${newAvatar}`
              })
            );
          });
        }
      });

      const memberQuery = db
        .collectionGroup("members")
        .where("uid", "==", `${userId}`);
      const res5 = memberQuery.get().then(querySnapshot => {
        if (querySnapshot.empty) {
          return null;
        } else {
          const promises = [];
          querySnapshot.forEach(doc => {
            promises.push(
              doc.ref.update({
                displayName: `${newUsername}`,
                avatar: `${newAvatar}`
              })
            );
          });
        }
      });

      return res1, res2, res3, res4, res5;
    } else {
      return null;
    }
  });

exports.postLikeCount = functions.firestore
  .document("posts/{postId}/postLikes/{userId}")
  .onCreate((change, context) => {
    const FieldValue = admin.firestore.FieldValue;
    const { postId, userId } = context.params;

    const res1 = db
      .collection("posts")
      .doc(postId)
      .update({ likeCount: FieldValue.increment(1) });

    const res2 = db
      .collection("posts")
      .doc(postId)
      .get()
      .then(function(doc1) {
        //postしたユーザーの取得
        const postUid = doc1.data().uid;
        if (userId !== postUid) {
          db.collection("users")
            .doc(userId)
            .get()
            .then(function(doc2) {
              //いいねしたユーザー情報の書き込み
              db.collection("users")
                .doc(postUid)
                .collection("notifications")
                .add({
                  displayName: doc2.data().displayName,
                  avatar: doc2.data().avatar,
                  id: postId,
                  type: "postLike",
                  uid: userId,
                  createTime: admin.firestore.FieldValue.serverTimestamp()
                });

              db.collection("users")
                .doc(postUid)
                .update({
                  notification: true
                });
            });
        }
      });

    return res1, res2;
  });

exports.communitiesPostLikeCount = functions.firestore
  .document("communities/{communityId}/posts/{postId}/postLikes/{userId}")
  .onCreate((change, context) => {
    const FieldValue = admin.firestore.FieldValue;
    const { communityId, postId, userId } = context.params;

    const res1 = db
      .collection("communities")
      .doc(communityId)
      .collection("posts")
      .doc(postId)
      .update({ likeCount: FieldValue.increment(1) });

    const res2 = db
      .collection("communities")
      .doc(communityId)
      .collection("posts")
      .doc(postId)
      .get()
      .then(function(doc1) {
        //postしたユーザーの取得
        const postUid = doc1.data().uid;
        if (userId !== postUid) {
          db.collection("users")
            .doc(userId)
            .get()
            .then(function(doc2) {
              //いいねしたユーザー情報の書き込み
              db.collection("users")
                .doc(postUid)
                .collection("notifications")
                .add({
                  displayName: doc2.data().displayName,
                  avatar: doc2.data().avatar,
                  id: postId,
                  type: "communityPostLike",
                  communityId: communityId,
                  uid: userId,
                  createTime: admin.firestore.FieldValue.serverTimestamp()
                });

              db.collection("users")
                .doc(postUid)
                .update({
                  notification: true
                });
            });
        }
      });

    return res1, res2;
  });

exports.commentLikeCount = functions.firestore
  .document("posts/{postId}/comments/{commentId}/commentLikes/{userId}")
  .onCreate((change, context) => {
    const FieldValue = admin.firestore.FieldValue;
    const { postId, commentId, userId } = context.params;
    let flg = true;

    const res1 = db
      .collection("posts")
      .doc(postId)
      .collection("comments")
      .doc(commentId)
      .update({ likeCount: FieldValue.increment(1) })
      .then(function() {
        db.collection("posts")
          .doc(postId)
          .collection("comments")
          .get(commentId)
          .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
              const commentUid = doc.data().uid;
              if (commentUid !== userId && flg === true) {
                db.collection("users")
                  .doc(commentUid)
                  .update({ point: FieldValue.increment(1) });
                flg = false;
              }
            });
          });
      });

    const res2 = db
      .collection("posts")
      .doc(postId)
      .collection("comments")
      .doc(commentId)
      .get()
      .then(function(doc1) {
        //commentしたユーザーの取得
        const commentUid = doc1.data().uid;
        if (userId !== commentUid) {
          db.collection("users")
            .doc(userId)
            .get()
            .then(function(doc2) {
              //いいねしたユーザー情報の書き込み
              db.collection("users")
                .doc(commentUid)
                .collection("notifications")
                .add({
                  displayName: doc2.data().displayName,
                  avatar: doc2.data().avatar,
                  id: postId,
                  type: "commentLike",
                  uid: userId,
                  createTime: admin.firestore.FieldValue.serverTimestamp()
                });

              db.collection("users")
                .doc(commentUid)
                .update({
                  notification: true
                });
            });
        }
      });

    return res1, res2;
  });

exports.CommunityCommentLikeCount = functions.firestore
  .document(
    "communities/{communityId}/posts/{postId}/comments/{commentId}/commentLikes/{userId}"
  )
  .onCreate((change, context) => {
    const FieldValue = admin.firestore.FieldValue;
    const { communityId, postId, commentId, userId } = context.params;
    let flg = true;

    const res1 = db
      .collection("communities")
      .doc(communityId)
      .collection("posts")
      .doc(postId)
      .collection("comments")
      .doc(commentId)
      .update({ likeCount: FieldValue.increment(1) })
      .then(function() {
        db.collection("communities")
          .doc(communityId)
          .collection("posts")
          .doc(postId)
          .collection("comments")
          .get(commentId)
          .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
              const commentUid = doc.data().uid;
              if (commentUid !== userId && flg === true) {
                db.collection("users")
                  .doc(commentUid)
                  .update({ point: FieldValue.increment(1) });
                flg = false;
              }
            });
          });
      });

    const res2 = db
      .collection("communities")
      .doc(communityId)
      .collection("posts")
      .doc(postId)
      .collection("comments")
      .doc(commentId)
      .get()
      .then(function(doc1) {
        //commentしたユーザーの取得
        const commentUid = doc1.data().uid;
        if (userId !== commentUid) {
          db.collection("users")
            .doc(userId)
            .get()
            .then(function(doc2) {
              //いいねしたユーザー情報の書き込み
              db.collection("users")
                .doc(commentUid)
                .collection("notifications")
                .add({
                  displayName: doc2.data().displayName,
                  avatar: doc2.data().avatar,
                  id: postId,
                  type: "communityCommentLike",
                  communityId: communityId,
                  uid: userId,
                  createTime: admin.firestore.FieldValue.serverTimestamp()
                });

              db.collection("users")
                .doc(commentUid)
                .update({
                  notification: true
                });
            });
        }
      });

    return res1, res2;
  });

exports.CommunityCommentUpdate = functions.firestore
  .document("communities/{communityId}/posts/{postId}/comments/{commentId}")
  .onCreate((change, context) => {
    const { communityId } = context.params;

    const res1 = db
      .collection("communities")
      .doc(communityId)
      .update({
        updateTime: admin.firestore.FieldValue.serverTimestamp()
      });

    return res1;
  });

exports.CommunityPostUpdate = functions.firestore
  .document("communities/{communityId}/posts/{postId}")
  .onCreate((change, context) => {
    const { communityId } = context.params;

    const res1 = db
      .collection("communities")
      .doc(communityId)
      .update({
        updateTime: admin.firestore.FieldValue.serverTimestamp()
      });

    return res1;
  });

exports.PostComment = functions.firestore
  .document("posts/{postId}/comments/{commentId}")
  .onCreate((snap, context) => {
    const { postId } = context.params;
    const displayName = snap.data().displayName;
    const avatar = snap.data().avatar;
    const uid = snap.data().uid;

    const res1 = db
      .collection("posts")
      .doc(postId)
      .get()
      .then(function(doc) {
        const postUid = doc.data().uid;
        if (postUid !== uid) {
          db.collection("users")
            .doc(postUid)
            .collection("notifications")
            .add({
              displayName: displayName,
              avatar: avatar,
              id: postId,
              type: "post",
              uid: uid,
              createTime: admin.firestore.FieldValue.serverTimestamp()
            });

          db.collection("users")
            .doc(postUid)
            .update({
              notification: true
            });
        }
      });

    return res1;
  });

exports.CommunityComment = functions.firestore
  .document("communities/{communityId}/posts/{postId}/comments/{commentId}")
  .onCreate((snap, context) => {
    const { postId, communityId } = context.params;
    const displayName = snap.data().displayName;
    const avatar = snap.data().avatar;
    const uid = snap.data().uid;

    const res1 = db
      .collection("communities")
      .doc(communityId)
      .collection("posts")
      .doc(postId)
      .get()
      .then(function(doc) {
        const postUid = doc.data().uid;
        if (postUid !== uid) {
          db.collection("users")
            .doc(postUid)
            .collection("notifications")
            .add({
              displayName: displayName,
              avatar: avatar,
              communityId: communityId,
              id: postId,
              type: "community",
              uid: uid,
              createTime: admin.firestore.FieldValue.serverTimestamp()
            });

          db.collection("users")
            .doc(postUid)
            .update({
              notification: true
            });
        }
      });

    return res1;
  });

exports.CommunityCreate = functions.firestore
  .document("communities/{communityId}")
  .onCreate((snap, context) => {
    const { communityId } = context.params;
    const uid = snap.data().uid;

    const res1 = db
      .collection("communities")
      .doc(communityId)
      .collection("members")
      .doc(uid)
      .set({
        uid: uid,
        role: "member"
      });

    return res1;
  });
