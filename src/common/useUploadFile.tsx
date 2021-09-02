import { useState } from "react";
import { database, storage } from "../firebase";
import { deleteAllSubItemFirebase } from "../utils/helpers/helpers";

const useUploadFile = (userId?: string) => {
  const [progress, setProgress] = useState<number>(0);
  const [url, setUrl] = useState<string>("");

  const handleUpload = async (blobUrl: any, type?: "avatar") => {
    const imgName = `${Date.now()}`;
    const rootFolder = `/${userId ? `users/${userId}` : "public"}`;
    const folderPath = `${rootFolder}/${type ? type + "/" : ""}`;

    if (blobUrl) {
      if (type === "avatar") deleteAllSubItemFirebase(folderPath); //nếu là type avatar thì xóa hết thư mục avatar trước khi up ảnh

      const response = await fetch(blobUrl);
      const image = await response.blob();
      const uploadTask = storage.ref(`${folderPath}${imgName}`).put(image);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progress);
        },
        (error) => {
          console.log(error);
        },
        () => {
          storage
            .ref(folderPath)
            .child(imgName)
            .getDownloadURL()
            .then((url) => {
              setUrl(url);
              //save avatar url to database
              if (type === "avatar") {
                const userData = database.ref();
                userData.child("users").child(userId).child("personal").update({
                  avatar: url,
                });
              }
            });
        }
      );
    }
  };

  const reset = () => {
    setProgress(0);
    setUrl("");
  };

  return { progress, url, handleUpload, reset };
};

export default useUploadFile;