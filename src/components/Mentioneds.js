import { Button, Grow } from '@material-ui/core';
import { Send } from '@material-ui/icons';
import React, { useState } from 'react'
import { CommunitiesTimeline } from './CommunitiesTimeline'
import axios from "axios";

import { MentionsInput, Mention } from 'react-mentions';
import { provideExampleValue } from './higer-order';
import { useSelector } from "react-redux";
import { useFirebase, useFirestoreConnect } from "react-redux-firebase";
import { useParams } from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";
import Posts from './CommunitiesTimeline/Posts';
import { isLoaded, isEmpty } from "react-redux-firebase";



function Mentioneds({ value, data, onChange }) {
  const auth = useSelector((state) => state.firebase.auth);
  const profile = useSelector((state) => state.firebase.profile);
  const [openSnack, setOpenSnack] = useState(false);
  const [content, setContent] = useState("");
  const [postImage, setPostImage] = useState("");
  const [posted, setPosted] = useState(true);
  const [postMsg, setPostMsg] = useState("");
  const [communityName, setCommunityName] = useState("");
  const [communityText, setCommunityText] = useState("");
  const [communityPublic, setCommunityPublic] = useState(true);
  const [communityRole, setCommunityRole] = useState(false);
  const [communityButton, setCommunityButton] = useState(true);
  const [communityDisplay, setCommunityDisplay] = useState(true);
  const params = { text: value };
  const firebase = useFirebase();
  const db = firebase.firestore();
  const { communityId } = useParams();
  const posts = useSelector(
    (state) => state.firestore.ordered[`posts-${communityId}`]
  );
  
  if (value !== "") {
    // setPosted(false);

    const url = "https://myflaskapi1234321.herokuapp.com/";
    axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";

    axios
      .get(url, { params })
      .then((results) => {
        if (results.data.result === "5" || results.data.result === "4") {
          setOpenSnack(true);
          setPostMsg("ポジティブな投稿をお願いします。");
          setPosted(true);
        } else {
          setPosted(false);
          if (postImage.name) {
            const filePath = "postImage";
            const date = new Date();
            const a = date.getTime();
            const b = Math.floor(a / 1000);
            const storageRef = firebase.storage().ref(filePath);
            const filePre = `${b}-${profile.username}`;
            const fileName = postImage.name;
            const imageRef = `${filePre}-${fileName}`;
            function splitExt(filename) {
              return filename.split(/\.(?=[^.]+$)/);
            }
            function thumbnailName(filename) {
              const filePre = splitExt(filename);
              return `${filePre[0]}_1000x1000.${filePre[1]}`;
            }

            storageRef
              .child(imageRef)
              .put(postImage)
              .then((snapshot) => {
                const uploadedPath = `thumbnails/${filePre}-${thumbnailName(
                  fileName
                )}`;
                setTimeout(() => {
                  storageRef
                    .child(uploadedPath)
                    .getDownloadURL()
                    .then(function (url) {
                      db.collection("communities")
                        .doc(communityId)
                        .collection("posts")
                        .add({
                          uid: auth.uid,
                          avatar: profile.avatar,
                          displayName: profile.displayName,
                          postImage: url,
                          username: profile.username,
                          content: value,
                          createTime: firebase.firestore.FieldValue.serverTimestamp(),
                          likeCount: 0,
                        });
                      setPosted(true);
                      setContent("");
                      setPostImage("");
                      setPostMsg("投稿が完了しました。");
                      setOpenSnack(true);
                    });
                }, 5000);
              })
              .catch((error) => {
                setPosted(true);
                setPostImage("");
                setPostMsg("10MB以下の画像をお願いします。");
                setOpenSnack(true);
              });
          } else {
            db.collection("communities")
              .doc(communityId)
              .collection("posts")
              .add({
                uid: auth.uid,
                avatar: profile.avatar,
                displayName: profile.displayName,
                username: profile.username,
                content: value,
                createTime: firebase.firestore.FieldValue.serverTimestamp(),
                likeCount: 0,
              });
            setPosted(true);
            setContent("");
            setPostMsg("投稿が完了しました。");
            setOpenSnack(true);
            setPostImage("");
          }
        }
      })
      .catch((error) => {
        alert(error);
      });
  }
    return (
      <div>
        
        <MentionsInput
          value={value}
          // onChange={onChange}
          placeholder={'入力してください。'}
        >
          <Mention data={data} />
        </MentionsInput>




        
        {posted ? (
          <Button
            type="button"
            variant="contained"
            color="primary"
            onClick={onchange}
          >
            投稿
          </Button>
        ) : (
          <div>
            <CircularProgress />
            <div style={{ fontSize: 12 }}>AI判定中</div>
          </div>
        )}


        {!isLoaded(posts) ? (
          <div></div>
        ) : isEmpty(posts) ? (
          <div></div>
        ) : (
          posts.map((post) => (
            <div>
              <Grow in={true} timeout={{ enter: 1000 }}>
                <Posts
                  id={post.id}
                  communityId={communityId}
                  uid={post.uid}
                  createTime={post.createTime}
                  avatar={post.avatar}
                  displayName={post.displayName}
                  content={post.content}
                  postImage={post.postImage}
                  likeCount={post.likeCount}
                />
              </Grow>
            </div>
          ))
        )}
        
      </div>
    )
  }
  const asExample = provideExampleValue('')
  
  export default asExample(Mentioneds)
  