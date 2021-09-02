import { storage } from '../../firebase';

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
