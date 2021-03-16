import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useFirebase } from "react-redux-firebase";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import { useParams, Link } from "react-router-dom";
import { Box } from "@material-ui/core";
import Grow from "@material-ui/core/Grow";
import IconButton from '@material-ui/core/IconButton';
import AddShoppingCartIcon from '@material-ui/icons/Cancel';
import { Cancel } from "@material-ui/icons";


const useStyles = makeStyles((theme) => ({
  username:{
    borderColor:"orange"
  },
  profileText:{
    borderColor:"#61C900"
  },

  userItem:{
    width:240
  },
  profileItem:{
    opacity:0.2,
    marginTop: 50,
    display: "flex",
    flexDirection: "column",
  },
  usernamePaper:{
    marginTop: 8,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  profileEdit:{
    opacity:0.5,
    textAlign: "right", 
  },
  editLink:{
    color: 'gray',
    textDecoration: 'none'
  },
  profileTextPaper:{
    opacity:0.2,
    marginTop: 70,
    display: "flex",
    flexDirection: "column"
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
  paper: {
    marginTop: 80,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  large: {
    width: theme.spacing(20),
    height: theme.spacing(20),
  },
  backpage: {
    opacity: 0.3,
    top: 100,
    right: 20,
    left: 'auto',
    position: 'fixed',
  }
}));

export default function UserPage(props) {
  const { username } = useParams();
  const firebase = useFirebase();
  const db = firebase.firestore();
  const [displayName, setDisplayName] = useState("");
  const [profileText, setProfileText] = useState("");
  const [avatar, setAvatar] = useState("");
  // const [displayNameGen, setDisplayNameGen] = useState("");
  // const [profileTextGen, setProfileTextGen] = useState("");
  // const [avatarGen, setAvatarGen] = useState("");
  const classes = useStyles();

  let match = false;
  const {userid} = useParams().uid;
  const user=firebase.auth().currentUser;
    
    db.collection('profile').doc(useParams().uid).get().then((doc) => {
      if (doc.exists) {
        setDisplayName(doc.data().displayName);
        setProfileText(doc.data().profileText);
        setAvatar(doc.data().avatar);
      }
      else {
        console.log('documentがありません。。')
      }
    })
    if (user === null){
      match = false;
    }
    else{
      if(userid === user.uid){
        match = true;
      }
      else{
        match = false;
      }
    }

    console.log(profileText);

  return (
    <Grow in={true} timeout={{ enter: 1000 }}>
      <Container className={classes.container}>
 
      <div className={classes.paper}>
        <Box>
          <Avatar
            alt="profile image"
            src={`${avatar}`}
            className={classes.large}
          />
          {match === true && 
          <Typography className={classes.profileEdit}>
            <Link to="/profile_edit" 
            className={classes.editLink}>編集</Link>
          </Typography>}

        </Box>
        
        <Grid item xs="10">
          <Box borderBottom={3} className={classes.username}>
            <Typography variant="h10" component="h10"
            className={classes.profileItem} >
            Name
            </Typography>
            <Typography variant="h5" component="h5"
            className={classes.usernamePaper}>
              {displayName}
            </Typography>
          </Box>
          <Box borderBottom={3} className={classes.profileText}>
            <Typography className={classes.profileTextPaper}>
              Profile
            </Typography>
              {profileText}
          </Box>
        </Grid>
      </div>
      </Container>
    </Grow>
  );
}
