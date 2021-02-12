import { Checkbox, makeStyles } from "@material-ui/core";
import React, { useState, useRef } from "react";
import { useFirebase } from "react-redux-firebase";
import { useParams } from "react-router-dom";




const useStyles = makeStyles((theme) => ({
    watchbuttonpotision:{
        textAlign:"right"
      },
      watchbuttontext: {
        fontWeight: "bold",
        fontSize: 13,
        opacity:0.5
      }
}))




export default function WatchCommunity(data) {
    const classes = useStyles()
    // let watchButtonFlag = true;
    let watchFlagStartStatus;
    const { communityId } = useParams();
    const fileInput = useRef(null);
    const firebase = useFirebase();
    const db = firebase.firestore();
    let user = firebase.auth().currentUser;
    let [watchButtonFlag,setwatchButtonFlag] = useState("");


    db
    .collection("communities")
    .doc(communityId)
    .collection("watchmember")
    .doc(user.uid)
    .get()
    .then(val => {
        if (val.data().watchFlag === true) {
        console.log('こっちきたよ');
        setwatchButtonFlag(true);
    } else{
        console.log('こっちきたよ！');
        setwatchButtonFlag(false)
    }
    })


    const watchButton = () => {
        console.log(watchButtonFlag);
        if (watchButtonFlag === true) {
            watchButtonFlag = false;
          // db.collection("communities")
          // .doc(communityId)
          // .collection("watchmember")
          // .doc(auth.uid)
          // .set({
          //   watchFlag: false 
          // });
        } else {
          watchButtonFlag = true;
          // db.collection("communities")
          // .doc(communityId)
          // .collection("watchmember")
          // .doc(auth.uid)
          // .set({
          //   watchFlag: true 
          // });
        }
        // console.log(watchButtonFlag);
      }
    

    return (
        <div className={classes.watchbuttonpotision}>
        <Checkbox
          onClick={watchButton}
          color="primary"
        />
          <span className={classes.watchbuttontext}>
            このコミュニティをウォッチする！
          </span>
        </div>
    )
}

