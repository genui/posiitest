import React from "react";
import PropTypes from "prop-types";
import { map } from "lodash";
import { useSelector } from "react-redux";
import { useFirebase, useFirebaseConnect } from "react-redux-firebase";
import { useDropzone } from "react-dropzone";

// Path within Database for metadata (also used for file Storage path)

export default function UploadTest() {
  const filePath = "avatars";
  const firebase = useFirebase();
  const profile = useSelector(state => state.firebase.profile);
  function splitExt(filename) {
    return filename.split(/\.(?=[^.]+$)/);
  }
  function thumbnailName(filename) {
    const filePre = splitExt(filename);
    return `${filePre[0]}_200x200.${filePre[1]}`;
  }
  function onDrop(file) {
    const date = new Date();
    const a = date.getTime();
    const b = Math.floor(a / 1000);
    const storageRef = firebase.storage().ref(filePath);
    const filePre = `${b}-${profile.username}`;
    const fileName = file[0].name;
    const imageRef = `${filePre}-${fileName}`;
    const fileRef = storageRef
      .child(imageRef)
      .put(file[0])
      .then(snapshot => {
        const uploadedPath = `thumbnails/${filePre}-${thumbnailName(fileName)}`;
        console.log(snapshot.state);
        console.log(uploadedPath);
        setTimeout(() => {
          const url = storageRef
            .child(uploadedPath)
            .getDownloadURL()
            .then(function(url) {
              console.log(url);
              firebase.updateProfile({
                avatar: url
              });
            });
        }, 5000);
      });
    /*
    const result = fileRef.putString(message).then(function(snapshot) {
      console.log("Uploaded a raw string!");
    });
    */
    //storageRef.child(`/${filePath}/thumbnails/${imageRef}`).getDownloadURL();
  }
  /*const uploadedFiles = useSelector(
    ({ firebase: { data } }) => data[filesPath]
  );

  const options = new Object();
  options.name = "test.jpg";

  function onDrop(file) {
    firebase.uploadFiles(filesPath, file, filesPath, options);
  }*/
  /*
  storageRef
    .child("/avatars/logo.png")
    .getDownloadURL()
    .then(function(url) {
      console.log(url);
    })
    .catch(function(e) {});
*/
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag 'n' drop some files here, or click to select files</p>
      )}
    </div>
  );
}
