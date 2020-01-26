// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

exports.updateProfileUsername = functions.firestore
    .document('users/{userId}')
    .onUpdate((change, context) => {
        const { userId } = context.params;

        var newUsername = change.after.data().displayName;
        var previousUsername = change.before.data().displayName;

        var newAvatar = change.after.data().avatar;
        var previousAvatar = change.before.data().avatar;

        if (newUsername.localeCompare(previousUsername) !== 0 || newAvatar.localeCompare(previousAvatar) !== 0) {
            const postCollectionRef = db.collection('posts');
            const postQuery = postCollectionRef.where('uid', '==', `${userId}`);

            const res1 = postQuery.get()
                .then(querySnapshot => {

                    if (querySnapshot.empty) {
                        return null;
                    } else {
                        const promises = []

                        querySnapshot.forEach(doc => {
                            promises.push(doc.ref.update({ displayName: `${newUsername}`, avatar: `${newAvatar}`}));
                        });

                        return Promise.all(promises);
                    }
                });

            const commentCollectionRef = db.collectionGroup('comments');
            const commentQuery = commentCollectionRef.where('uid', '==', `${userId}`);

            const res2 = commentQuery.get()
                .then(querySnapshot => {

                    if (querySnapshot.empty) {
                        return null;
                    } else {
                        const promises = []

                        querySnapshot.forEach(doc => {
                            promises.push(doc.ref.update({ displayName: `${newUsername}`, avatar: `${newAvatar}`}));
                        });

                        return Promise.all(promises);
                    }
                });
            return (res1, res2)
        } else {
            return null;
        }
    });



exports.postLikeCount = functions.firestore
      .document('posts/{postId}/postLikes/{userId}')
      .onCreate((change, context) => {

  const FieldValue = admin.firestore.FieldValue;
  const { postId } = context.params;

  return db.collection('posts').doc(postId).update({likeCount: FieldValue.increment(1)});
});

exports.commentLikeCount = functions.firestore
      .document('posts/{postId}/comments/{commentId}/commentLikes/{userId}')
      .onCreate((change, context) => {

  const FieldValue = admin.firestore.FieldValue;
  const { postId, commentId } = context.params;
    
  
  return db.collection('posts').doc(postId).collection('comments').doc(commentId).update({likeCount: FieldValue.increment(1)});
});