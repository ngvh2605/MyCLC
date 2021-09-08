import { useState } from "react";
import { database, storage } from "../firebase";
import { deleteAllSubItemFirebase } from "../utils/helpers/helpers";

const useUploadFile = (userId?: string) => {
  const handleUploadImage = async (blobUrl: any, type?: "avatar" | "news") => {
    const imgName = `${Date.now()}`;
    const rootFolder = `/${userId ? `users/${userId}` : "public"}`;
    const folderPath = `${rootFolder}/${type ? type + "/" : ""}`;

    if (type === "avatar") deleteAllSubItemFirebase(folderPath); //nếu là type avatar thì xóa hết thư mục avatar trước khi up ảnh
    const response = await fetch(blobUrl);
    const image = await response.blob();
    const snapshot = await storage.ref(`${folderPath}${imgName}`).put(image);
    const uploadedUrl = await snapshot.ref.getDownloadURL();
    return uploadedUrl;
  };

  return { handleUploadImage };
};

export default useUploadFile;
