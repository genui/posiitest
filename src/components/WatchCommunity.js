import { Checkbox, makeStyles } from "@material-ui/core";
import { de } from "date-fns/locale";
import React, { useState, useRef, useEffect } from "react";
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


    useEffect(() => {
      db.collection('communities')
      .doc(communityId)
      .collection('watchmember')
      .get()
      .then((valwatch) => {
        if(valwatch.docs.length===0){
          db.collection('communities')
          .doc(communityId)
          .collection('watchmember')
          .doc(user.uid)
          .set({
            watchFlag:false
          })
        } else {
          try {
            db
            .collection("communities")
            .doc(communityId)
            .collection("watchmember")
            .doc(user.uid)
            .get()
            .then(val => {
              if(val.exists){
                  if (val.data().watchFlag === true) {
                    setwatchButtonFlag(true);
                } else{
                    setwatchButtonFlag(false)
                }

              }
            })
          } catch(e){
            console.log('error');
          }
        }
      })

      }, 1);



    const watchButton = () => {
        if (watchButtonFlag === true) {
          setwatchButtonFlag(false)
            watchButtonFlag = false;
          db.collection("communities")
          .doc(communityId)
          .collection("watchmember")
          .doc(data.data.uid)
          .set({
            watchFlag: false 
          });
        } else {
          setwatchButtonFlag(true)
          watchButtonFlag = true;
          db.collection("communities")
          .doc(communityId)
          .collection("watchmember")
          .doc(data.data.uid)
          .set({
            watchFlag: true 
          });
        }
      }
    

    return (
        <div className={classes.watchbuttonpotision}>
        <Checkbox
          onClick={watchButton}
          color="primary"
          checked={watchButtonFlag}
        />
          <span className={classes.watchbuttontext}>
            このコミュニティをウォッチする！
          </span>
        </div>
    )
}

