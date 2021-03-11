import React, { useState, useRef, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { isEmpty, isLoaded, useFirebase, useFirestoreConnect } from "react-redux-firebase";
import { useSelector } from "react-redux";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { AddAPhoto } from "@material-ui/icons";
import axios from "axios";
import Snackbar from "@material-ui/core/Snackbar";
import { useParams } from "react-router-dom";
import { Chip, CircularProgress, Grow } from "@material-ui/core";
import Posts from "./Posts";
import color from "@material-ui/core/colors/amber";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#f8f8f8",
    flexGrow: 1,
    minHeight: 500,
    paddingTop: 30,
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  flex: {
    flexGrow: 1,
  },
  link: {
    textDecoration: "none",
    color: "black",
  },
  button: {
    color: "white",
  },
  middle: {
    width: theme.spacing(6),
    height: theme.spacing(6),
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  camera: {
    marginRight: 10,
    verticalAlign: "middle",
    "&:hover": {
      cursor: "pointer",
      opacity: 0.5,
    },
  },
  delete: {
    "&:hover": {
      cursor: "pointer",
      opacity: 0.5,
    },
  },
  comment: {
    "&:hover": {
      cursor: "pointer",
      opacity: 0.5,
    },
  },
  like: {
    "&:hover": {
      cursor: "pointer",
      opacity: 0.5,
    },
  },
  liked: {
    color: "#fa9200",
  },
  snackbar: {
    backgroundColor: "#fa9200",
  },
  postButtons: {
    display: "flex",
    flexFlow: "wrap",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  commentButtons: {
    display: "flex",
    flexFlow: "wrap",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  coflictuser: {
    marginTop:50,
    marginBottom:10,
    opacity:0.6,
    fontWeight:"bold"
  },
  coflictuserlist: {
    marginBottom:10
  },
  postButton:{
    color:'white',
    fontWeight:'bold'
  },
  timelineColor:{
    color:'#00E4E8'
  }
}));


export default function PostTimeline(data) {
  const { communityId } = useParams();
  const fileInput = useRef(null);
  const firebase = useFirebase();
  const db = firebase.firestore();

  firebase.firestore();
  useFirestoreConnect([
    {
      collection: "timeline",
      doc: "timelineDoc",
      subcollections: [{ collection: "posts" }],
      orderBy: ["createTime", "desc"],
      storeAs: `posts-${communityId}`,
    },
  ]);


  const auth = useSelector((state) => state.firebase.auth);
  const profile = useSelector((state) => state.firebase.profile);
  const [openSnack, setOpenSnack] = useState(false);
  const [content, setContent] = useState("");
  const [postImage, setPostImage] = useState("");
  const [posted, setPosted] = useState(true);
  const [postMsg, setPostMsg] = useState("");
  const [communityPublic, setCommunityPublic] = useState(true);
  const [communityRole, setCommunityRole] = useState(false);
  const [communityDisplay, setCommunityDisplay] = useState(true);
  const classes = useStyles();
  const [mentioncontent, setMentioncontent] = useState("");
  const [flagHEIC, setflagHEIC] = useState(false)
  let [usersconflict,setUsersConflict] = useState([]);
  let [selectUser,setSelectUser] = useState("");
  const posts = useSelector(
    (state) => state.firestore.ordered[`posts-${communityId}`]
  );
  const handleContentChange = (event) => {
    setContent(event.target.value);
    // if(event.target.value.match(/@/)) {

    //   if(event.target.value.match(/ /) || event.target.value.match(/　/)){
    //     setMentioncontentflag(false)
    //   } else {
    //     setMentioncontentflag(true)
    //     setMentioncontent(event.target.value)
    //   }
    // }
  };

//   const conflictUserChoice = (id) => {
//     setMentiondata(id)
//     setMentionFlag(true)
//     handleContentSubmit2(id);
//   }

  const handleImageChange = (event) => {
    const file = event.target.files;
    if(file[0].name.match('.HEIC') || file[0].name.match('.HEUC')) {
      setflagHEIC(true)
      setPostImage("");
      setPostMsg("アップロードできませんでした。拡張子がHEIC（iPhone1で撮った写真等）の場合はアップロードできません。");
      setOpenSnack(true);
    }else {
      setPostImage(file[0]);
      setflagHEIC(false)
      }
  };
  const handleImageClick = (event) => {
    fileInput.current.click();
  };

  const handleContentSubmit = () => {
    let userconflict = [];
    let userCount =0;
    let userDisplayName = '';
    if (content.match(/@/)){
      userDisplayName = mentioncontent.slice(1)

      for (let i = 0; i < data.data.length; i++){
        if (data.data[i].display === userDisplayName){
          userCount += 1;
        //   setdataId(data.data[i].id);
          db.collection('profile').doc(data.data[i].id).get().then(function (doc){
            if (doc.data().profileText == null) {
              userconflict.push(
                {
                  id: data.data[i].id,
                  avatar:doc.data().avatar,
                  profile:'コメントが設定されていません。'
                })
            } else {
              let profileTextContent = doc.data().profileText;
              let profileComment = "";
              if (profileTextContent.length >= 14) {
                profileComment = profileTextContent.substr(0,15);
              } else {
                profileComment = profileTextContent
              }
              userconflict.push(
                {
                  id:data.data[i].id,
                  avatar:doc.data().avatar,
                  profile:profileComment+'...'
                })
            }
          })
        }
      }

      if (userCount >= 2) {
        setSelectUser(
          <div className={classes.coflictuser}>
          どの{userDisplayName}さんですか？
          </div>
        );
        setPostMsg('2人以上のユーザが見つかりました。')
        setOpenSnack(true);
        setPosted(true);
        setUsersConflict(userconflict)
      } else {
        if (userCount === 0){
          setOpenSnack(true)
          setPostMsg(mentioncontent+'というユーザはいません！')
          setPosted(true);
        } else {
          setTimeout(() => {
            handleContentSubmit2(userconflict[0].id);
          }, 3000);
        }
      }
    } else {
      handleContentSubmit2()
    }
  }



  const handleContentSubmit2 = (id) => {
    if (content !== "") {
      setPosted(false);
      const params = { text: content };
      const url = "https://myflaskapi1234321.herokuapp.com/";
      axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";
      axios
      .get(url, { params })
      .then((results) => {
        setPosted(false);
        //   setMentionFlag(false);
        //   setMentiondata('')
          setUsersConflict([])
          setSelectUser('')
          if (postImage.name) {
            const filePath = "postImage";
            const date = new Date();
            const a = date.getTime();
            const b = Math.floor(a / 1000);
            const storageRef = firebase.storage().ref(filePath);
            const fileName = postImage.name;
            const imageRef = `${b}-${fileName}`;
            storageRef
            .child(imageRef)
            .put(postImage)
            .then(snapshot => {
              const uploadedPath = `${b}-${fileName}`;
              setTimeout(() => {
                storageRef
                  .child(uploadedPath)
                  .getDownloadURL()
                  .then(function(url) {
                  db.collection("communities")
                    .doc(communityId)
                    .collection("posts")
                    .add({
                      uid: auth.uid,
                      avatar: profile.avatar,
                      displayName: profile.displayName,
                      postImage: url,
                      username: profile.username,
                      content: content,
                      createTime: firebase.firestore.FieldValue.serverTimestamp(),
                      likeCount: 0,
                      mention: false,
                      heif:flagHEIC
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
              let setid = ''
              if(id){
                setid = id
              } else {
                setid = 'none'
              }
              db.collection("timeline")
                .doc("timelineDoc")
                .collection("posts")
                .add({
                  uid: auth.uid,
                  avatar: profile.avatar,
                  displayName: profile.displayName,
                  username: profile.username,
                  content: content,
                  createTime: firebase.firestore.FieldValue.serverTimestamp(),
                  likeCount: 0,
                  mention:setid
                });
              setPosted(true);
              setContent("");
              setPostMsg("投稿が完了しました。");
              setOpenSnack(true);
              setPostImage("");
            }
        })
        .catch((error) => {
          alert(error);
        });
    }
  };

  const handleSnackClose = () => {
    setOpenSnack(false);
  };

  return (
    <div className={classes.root}>
      <Container component="main" maxWidth="sm">
        {communityDisplay && (
          <Card className={classes.card} style={{ marginBottom: 30 }}>
            <CardContent>

              <Grid container spacing={3}>
                <Grid item xs="2">
                  <Avatar
                    aria-label="recipe"
                    src={`${profile.avatar}`}
                    className={classes.middle}
                    style={{ marginTop: 30 }}
                  />
                </Grid>

                <Grid item xs="10" style={{ marginTop: 20 }}>
                  <TextField
                    id="standard-basic"
                    label="投稿"
                    fullWidth
                    multiline={true}
                    rows={1}
                    rowsMax={5}
                    onChange={handleContentChange}
                    value={content}
                  />
                  {selectUser}
                  {usersconflict.map((val)=>
                    <Chip
                    　className={classes.coflictuserlist}
                    //   onClick={() => conflictUserChoice(val.id)}
                      label={val.profile}
                      avatar={
                        <Avatar
                          src={val.avatar}
                        />
                      }/>
                    )}

                  <div>
                    <Grid container spacing={3}>
                      <Grid
                        item
                        xs="8"
                        sm="6"
                        style={{ marginTop: 20 }}
                        onClick={handleImageClick}
                      >
                        <input
                          type="file"
                          id="imageForm"
                          onChange={handleImageChange}
                          ref={fileInput}
                          style={{
                            display: "none",
                          }}
                        />
                        <AddAPhoto className={classes.camera} />
                        <span style={{ verticalAlign: "middle", fontSize: 14 }}>
                          {postImage.name}
                        </span>
                      </Grid>
                      <Grid
                        item
                        xs="4"
                        sm="6"
                        style={{ marginTop: 20, textAlign: "right" }}
                      >
                        {posted ? (
                          <Button
                          type="button"
                          variant="contained"
                          className={classes.postButton}
                          color='primary'
                          onClick={handleContentSubmit}
                        >
                          投稿
                        </Button>
                        ) : (
                          <Button color='primary'>
                            投稿中 <CircularProgress size={15} />
                          </Button>
                        )}
                      </Grid>
                    </Grid>
                  </div>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
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
                  heif={post.heif}
                />
              </Grow>
            </div>
          ))
        )}
      </Container>
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={openSnack}
        onClose={handleSnackClose}
        autoHideDuration={5000}
        message={<span>{postMsg}</span>}
        ContentProps={{
          classes: {
            root: classes.snackbar,
          },
        }}
      />
    </div>
  );
}