import { useState } from 'react';
import { storage } from '../firebase';
import { deleteAllSubItemFirebase } from '../utils/helpers/helpers';

const useUploadFile = (userId?: string) => {
  const [progress, setProgress] = useState<number>(0);
  const [url, setUrl] = useState<string>('');

  const handleUpload = (image: any, type?: 'avatar') => {
    const imgName = `${Date.now()}_${image?.name}`;
    const rootFolder = `/${userId ? `users/${userId}` : 'public'}`;
    const folderPath = `${rootFolder}/pictures/${type ? type + '/' : ''}`;

    if (image) {
      if (type === 'avatar') deleteAllSubItemFirebase(folderPath); //nếu là type avatar thì xóa hết thư mục avatar trước khi up ảnh

      const uploadTask = storage.ref(`${folderPath}${imgName}`).put(image);
      uploadTask.on(
        'state_changed',
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
            });
        }
      );
    }
  };

  const reset = () => {
    setProgress(0);
    setUrl('');
  };

  return { progress, url, handleUpload, reset };
};

export default useUploadFile;
