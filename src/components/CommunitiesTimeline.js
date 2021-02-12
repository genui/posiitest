import React, { useState, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useFirebase, useFirestoreConnect } from "react-redux-firebase";
import { useSelector } from "react-redux";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { AddAPhoto } from "@material-ui/icons";
import { isLoaded, isEmpty } from "react-redux-firebase";
import Grow from "@material-ui/core/Grow";
import CircularProgress from "@material-ui/core/CircularProgress";
import Posts from "./CommunitiesTimeline/Posts";
import axios from "axios";
import Snackbar from "@material-ui/core/Snackbar";
import { useParams } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import Linkify from "material-ui-linkify";
import { MentionsInput, Mention } from 'react-mentions';
import defaultMentionStyle from './Style/defaultMentionStyle';
import defaultStyle from './Style/defaultStyle';
import { Checkbox, Chip } from "@material-ui/core";
import { useInView } from 'react-intersection-observer';
import WatchCommunity from "./WatchCommunity";


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
  }

}));


export default function CommunitiesTimeline(data) {
  const { communityId } = useParams();
  const fileInput = useRef(null);
  const firebase = useFirebase();
  const db = firebase.firestore();

  firebase.firestore();
  useFirestoreConnect([
    {
      collection: "communities",
      doc: communityId,
      subcollections: [{ collection: "posts" }],
      orderBy: ["createTime", "desc"],
      storeAs: `posts-${communityId}`,
    },
  ]);

  const posts = useSelector(
    (state) => state.firestore.ordered[`posts-${communityId}`]
  );

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
  const classes = useStyles();
  const [mentionFlag, setMentionFlag] = useState(false); 
  const [mentioncontent, setMentioncontent] = useState("");
  const [mentioncontentflag, setMentioncontentflag] = useState(false);

  const [dataId, setdataId] = useState("");
  const [mentiondata,setMentiondata] = useState("");
  let [usersconflict,setUsersConflict] = useState([]);
  let [selectUser,setSelectUser] = useState("");
  let user = firebase.auth().currentUser;
  let watchlist = '';


  db.collection("communities")
    .doc(communityId)
    .get()
    .then(function (doc) {
      setCommunityName(doc.data().name);
      setCommunityText(doc.data().text);
      setCommunityPublic(doc.data().public);
    });

  db.collection("communities")
    .doc(communityId)
    .collection("watchmember")
    .get()
    .then(function (doc) {
      watchlist = doc.docs
      // setwatchlist(doc.docs)
    });

  if (user) {
    db.collection("communities")
      .doc(communityId)
      .collection("members")
      .doc(auth.uid)
      .get()
      .then(function (doc) {
        if (doc.data()) {
          setCommunityRole(doc.data().role);
          if (communityRole === "regist") {
            setCommunityButton(false);
          }
        }
        if (communityPublic === true || communityRole === "member") {
          setCommunityDisplay(true);
        } else {
          setCommunityDisplay(false);
        }
      });
  }





  const handleContentChange = (event) => {
    setContent(event.target.value);
    if(event.target.value.match(/@/)) {

      if(event.target.value.match(/ /) || event.target.value.match(/　/)){
        console.log('キャンセルテスト');
        setMentioncontentflag(false)
      } else {
        console.log('@テスト');
        setMentioncontentflag(true)
        setMentioncontent(event.target.value)
      }
    }
  };

  const conflictUserChoice = (id) => {
    setMentiondata(id)
    setMentionFlag(true)
    handleContentSubmit2(id);
  }

  const handleImageChange = (event) => {
    const file = event.target.files;
    console.log(file);
    if(file[0].name.match('.HEIC') || file[0].name.match('.HEUC')) {
      setPostImage("");
      setPostMsg("アップロードできませんでした。拡張子がHEIC（iPhone1で撮った写真等）の場合はアップロードできません。");
      setOpenSnack(true);
    }else {
      setPostImage(file[0]);
      }
  };
  const handleImageClick = (event) => {
    fileInput.current.click();
  };

  const handleClickRegist = (event) => {
    db.collection("communities")
      .doc(communityId)
      .collection("members")
      .doc(auth.uid)
      .set({
        role: "regist",
        uid: auth.uid,
        displayName: profile.displayName,
        avatar: profile.avatar,
      });
    setCommunityButton(false);
    setPostMsg("参加申請をしました。");
    setOpenSnack(true);
  };
  const handleContentSubmit = () => {
    let userconflict = [];
    let userCount =0;
    let userDisplayName = '';
    if (content.match(/@/)){
      userDisplayName = mentioncontent.slice(1)

      for (let i = 0; i < data.data.length; i++){
        console.log(data.data[i].display);
        if (data.data[i].display === userDisplayName){
          userCount += 1;
          setdataId(data.data[i].id);
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
            console.log(userconflict);
            console.log(userconflict[0].id);
            // userAvatar.push(
              // <Avatar
              // aria-label="recipe"
              // src={doc.data().avatar}
              // className={classes.middle}
              // style={{ marginTop: 30 }} />
            // )
          })
        }
      }

      // setAvatarImg(userAvatar);
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
        if (results.data.result === "5" || results.data.result === "4") {
          setOpenSnack(true);
          setPostMsg("ポジティブな投稿をお願いします。");
          setPosted(true);
        } else {
          setPosted(false);
          setMentionFlag(false);
          setMentiondata('')
          setUsersConflict([])
          setSelectUser('')
          if (postImage.name) {
            // const filePath = "postImage";
            // const date = new Date();
            // const a = date.getTime();
            // const b = Math.floor(a / 1000);
            // const storageRef = firebase.storage().ref(filePath);
            // const filePre = `${b}-${profile.username}`;
            // const fileName = postImage.name;
            // const imageRef = `${filePre}-${fileName}`;
            // function splitExt(filename) {
            //   return filename.split(/\.(?=[^.]+$)/);
            // }
            // function thumbnailName(filename) {
            //   const filePre = splitExt(filename);
            //   return `${filePre[0]}_800x800.${filePre[1]}`;
            // }
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
                      mention: false
                    });
                setPosted(true);
                setContent("");
                setPostImage("");
                setPostMsg("投稿が完了しました。");
                setOpenSnack(true);
                  });
              }, 5000);
            })
            // storageRef
            //   .child(imageRef)
            //   .put(postImage)
            //   .then((snapshot) => {
            //     // const uploadedPath = `thumbnails/${filePre}-${thumbnailName(
            //     const uploadedPath = `${filePre}-${thumbnailName(
            //       fileName
            //     )}`;
            //     setTimeout(() => {
            //       console.log('アップロード開始');
            //       storageRef
            //         .child(uploadedPath)
            //         .getDownloadURL()
            //         .then(function (url) {
            //           db.collection("communities")
            //             .doc(communityId)
            //             .collection("posts")
            //             .add({
            //               uid: auth.uid,
            //               avatar: profile.avatar,
            //               displayName: profile.displayName,
            //               postImage: url,
            //               username: profile.username,
            //               content: content,
            //               createTime: firebase.firestore.FieldValue.serverTimestamp(),
            //               likeCount: 0,
            //               mention: false
            //             });
            //           setPosted(true);
            //           setContent("");
            //           setPostImage("");
            //           setPostMsg("投稿が完了しました。");
            //           setOpenSnack(true);
            //         });
            //     }, 5000);

            //   })
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
              db.collection("communities")
                .doc(communityId)
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
              // sendMentionEmail(id)
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
  };

  const handleSnackClose = () => {
    setOpenSnack(false);
  };
  // let mentionuser = [];
  // db.collection("profile").get().then(value =>{
  //   const usercount = value.docs.length;
  //   for(let i=0; i<usercount; i++){
  //     let id = value.docs[i].id
  //     db.collection('profile').doc(id).get().then(val => 
  //       {
  //       let displayName = val.data().displayName
  //       let subusermention = {
  //         "id": id,
  //         "display": displayName
  //       }
  //       let testarray = [];
  //       mentionuser.push(
  //         {
  //           'id':id,
  //           'displayName':displayName
  //         }
  //       )
  //       testarray = allusermention.concat(subusermention)
  //       // console.log(testarray[0]);
  //       // mentionuser.push(testarray);
  //       console.log(testarray);
  //     })
  //   }
  // });

  // console.log(mentionuser,'ユーザ取得');
  // console.log(typeof(mentionuser));
  

  const mentionSet = (args) =>{
    setMentionFlag(true);
    setMentiondata(args);
  }

  const [ref, inView] = useInView({
    threshold:0,
  });


  return (
    <div className={classes.root}>
      <Container component="main" maxWidth="sm">
        <Card style={{ marginBottom: 20 }}>
          <CardContent>
            <Typography
              gutterBottom
              variant="h5"
              component="h2"
              style={{ color: "#000" }}
            >
              {communityName}{" "}
              <span style={{ fontSize: 15 }}>
                {!communityPublic && " 非公開"}
              </span>
            </Typography>
            <Linkify>
              <Typography
                variant="body2"
                color="textSecondary"
                component="p"
                style={{ whiteSpace: "pre-line" }}
              >
                {communityText}
              </Typography>
            </Linkify>
            <WatchCommunity data={auth} />
            {!communityDisplay && (
              <div>
                <Typography variant="body2" color="textSecondary" component="p">
                  ※このページは非公開です。
                </Typography>
                　
                {communityButton ? (
                  <Button
                    type="button"
                    variant="contained"
                    color="primary"
                    style={{ marginTop: 10 }}
                    onClick={handleClickRegist}
                  >
                    参加を希望する
                  </Button>
                ) : (
                  <div>申請中です</div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
        
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
                      onClick={() => conflictUserChoice(val.id)}
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
                            color="primary"
                            onClick={handleContentSubmit}
                          >
                            投稿
                          </Button>
                        ) : (
                          <div>
                            <CircularProgress />
                            <div style={{ fontSize: 12 }}>AI判定中</div>
                          </div>
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