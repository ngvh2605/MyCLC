import { useState } from "react";
import { database, storage } from "../firebase";
import { deleteAllSubItemFirebase } from "../utils/helpers/helpers";

const useUploadFile = (userId?: string) => {
  const [url, setUrl] = useState<string>("");

  const handleUploadImage = async (
    blobUrl: any,
    type?:
      | "avatar"
      | "news"
      | "events"
      | "adventure"
      | "in2clc"
      | "frame"
      | "certiDatabase",
    name?: string
  ) => {
    const imgName = name ? name : `${Date.now()}.png`;
    const rootFolder = `/${userId ? `users/${userId}` : "public"}`;
    const folderPath = `${rootFolder}/${type ? type + "/" : ""}`;

    if (type === "avatar") deleteAllSubItemFirebase(folderPath); //nếu là type avatar thì xóa hết thư mục avatar trước khi up ảnh

    const response = await fetch(blobUrl);
    const image = await response.blob();
    const snapshot = await storage.ref(`${folderPath}${imgName}`).put(image);
    const uploadedUrl = await snapshot.ref.getDownloadURL();

    if (type === "avatar") imageFaceDetection(uploadedUrl);
    setUrl(uploadedUrl);
    return uploadedUrl;
  };

  const imageFaceDetection = (url: string) => {
    const options = {
      method: "POST",
      url: "https://face-detection6.p.rapidapi.com/img/face",
      headers: {
        "content-type": "application/json",
        "x-rapidapi-host": "face-detection6.p.rapidapi.com",
        "x-rapidapi-key": "215481281amsh1c8a8021452f9ecp149b18jsn2e71712e8c32",
      },
      data: {
        url: url,
        accuracy_boost: 1,
      },
    };

    const axios = require("axios");

    axios
      .request(options)
      .then(function (response: any) {
        const data = response.data;
        console.log(data);
        if (
          data.detected_faces &&
          data.detected_faces.length &&
          data.detected_faces.length === 1
        ) {
          const userData = database.ref();
          userData.child("users").child(userId).child("verify").update({
            avatarVerify: true,
          });
        } else {
          const userData = database.ref();
          userData.child("users").child(userId).child("verify").update({
            avatarVerify: false,
          });
        }
      })
      .catch(function (error: any) {
        console.error(error);
        const userData = database.ref();
        userData.child("users").child(userId).child("verify").update({
          avatarVerify: false,
        });
      });
  };

  return { url, handleUploadImage };
};

export default useUploadFile;
