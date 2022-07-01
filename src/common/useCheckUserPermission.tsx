import { useEffect, useState } from "react";
import { database } from "../firebase";

const useCheckUserPermission = (userId: string) => {
  const [status, setStatus] = useState<{
    allowCreateNews: boolean;
    allowCreateEvent: boolean;
    isAdmin: boolean;
  }>({
    allowCreateNews: false,
    allowCreateEvent: false,
    isAdmin: false,
  });

  useEffect(() => {
    if (userId) {
      database
        .ref()
        .child("auth")
        .child(userId)
        .once("value")
        .then((snapshot) => {
          const data = snapshot.val();

          setStatus({
            allowCreateEvent: data && data.createEvent,
            allowCreateNews: data && data.createNews,
            isAdmin: data && data.isAdmin,
          });
        });
    }
  }, [userId]);

  return {
    ...status,
  };
};

export default useCheckUserPermission;
