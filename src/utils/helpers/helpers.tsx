import { storage } from '../../firebase';
import jimp from 'jimp';

export const isEmail = (email) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@\\"]+(\.[^<>()[\]\\.,;:\s@\\"]+)*)|(\\".+\\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

export const deleteAllSubItemFirebase = (path: string) => {
  const storageRef = storage.ref(path);
  storageRef.listAll().then((listResults) => {
    const promises = listResults.items.map((item) => {
      return item.delete();
    });
    Promise.all(promises);
  });
};

export const resizeImage = async (url: string, maxSize: number) => {
  // Read the image.
  const image = await jimp.read(url);

  // Resize the image to width 150 and auto height.
  console.log(image.getWidth(), image.getHeight());
  const width = image.getWidth();
  const height = image.getHeight();
  if (width < height) {
    image.resize(jimp.AUTO, maxSize);
  } else image.resize(maxSize, jimp.AUTO);
  // Save and overwrite the image
  //await image.writeAsync("test/image.png");
  return image.getBase64Async(jimp.MIME_JPEG);
};
