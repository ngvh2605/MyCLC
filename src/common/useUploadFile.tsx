import { useState } from 'react';
import { storage } from '../firebase';

const useUploadFile = (userId) => {
  const [progress, setProgress] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [url, setUrl] = useState<string>('');

  const handleUpload = (image: any, type?: 'avatar') => {
    if (image) {
      const imgName = `${Date.now()}_${image?.name}`;
      const folderPath = `/users/${userId}/pictures/${type ? type + '/' : ''}`;
      const uploadTask = storage.ref(`${folderPath}${imgName}`).put(image);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progress);
          progress === 100 ? setLoading(true) : setLoading(false);
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
    setLoading(false);
  };

  return { progress, loading, url, handleUpload, reset };
};

export default useUploadFile;
