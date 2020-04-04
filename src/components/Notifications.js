import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useFirebase, useFirestoreConnect } from "react-redux-firebase";
import { useSelector } from "react-redux";
import Container from "@material-ui/core/Container";
import Avatar from "@material-ui/core/Avatar";
import Card from "@material-ui/core/Card";
import { isLoaded, isEmpty } from "react-redux-firebase";
import Grow from "@material-ui/core/Grow";
import Typography from "@material-ui/core/Typography";
import CardHeader from "@material-ui/core/CardHeader";
import Link from "@material-ui/core/Link";

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
    "&:hover": {
      textDecoration: "none",
    },
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
}));

function dateDisplay(date) {
  if (date !== "") {
    const dt = date.toDate();
    const year = dt.getFullYear();
    const month = dt.getMonth() + 1;
    const day = dt.getDate();
    return `${year}年${month}月${day}日`;
  }
}

function getMessage(type, username) {
  if (type === "community") {
    return username + "さんがあなたの投稿にコメントしました。";
  }
  if (type === "communityPostLike") {
    return username + "さんがあなたの投稿にいいねしました。";
  }

  if (type === "communityCommentLike") {
    return username + "さんがあなたのコメントにいいねしました。";
  }

  if (type === "communityMember") {
    return username + "さんがコミュニティへの参加を希望しています。";
  }
}

function getLink(type, postId, communityId) {
  if (
    type === "community" ||
    type === "communityPostLike" ||
    type === "communityCommentLike"
  ) {
    return "/communities/" + communityId + "/posts/" + postId;
  }

  if (type === "communityMember") {
    return "/communities/edit/" + communityId;
  }
}

export default function Notifications() {
  const firebase = useFirebase();

  firebase.firestore();

  const auth = useSelector((state) => state.firebase.auth);
  const classes = useStyles();

  firebase.updateProfile({
    notification: false,
  });

  useFirestoreConnect([
    {
      collection: "users",
      doc: auth.uid,
      subcollections: [{ collection: "notifications" }],
      orderBy: ["createTime", "desc"],
      storeAs: `notifications`,
    },
  ]);

  const notifications = useSelector(
    (state) => state.firestore.ordered.notifications
  );

  return (
    <div className={classes.root}>
      <Container component="main" maxWidth="sm">
        <Typography
          gutterBottom
          variant="h5"
          component="h2"
          style={{ color: "#000" }}
        >
          お知らせ
        </Typography>

        {!isLoaded(notifications) ? (
          <div></div>
        ) : isEmpty(notifications) ? (
          <div>
            <Grow in={true} timeout={{ enter: 1000 }}>
              <Card className={classes.card} style={{ marginBottom: 20 }}>
                <CardHeader subheader={"新着情報はありません"} />
              </Card>
            </Grow>
          </div>
        ) : (
          notifications.map((notification) => (
            <div>
              <Grow in={true} timeout={{ enter: 1000 }}>
                <Card className={classes.card} style={{ marginBottom: 20 }}>
                  <Link
                    href={getLink(
                      notification.type,
                      notification.id,
                      notification.communityId
                    )}
                    className={classes.link}
                  >
                    <CardHeader
                      avatar={
                        <Avatar
                          aria-label="recipe"
                          src={notification.avatar}
                          className={classes.avatar}
                        />
                      }
                      title={
                        notification.createTime &&
                        dateDisplay(notification.createTime)
                      }
                      subheader={getMessage(
                        notification.type,
                        notification.displayName
                      )}
                    />
                  </Link>
                </Card>
              </Grow>
            </div>
          ))
        )}
      </Container>
    </div>
  );
}
