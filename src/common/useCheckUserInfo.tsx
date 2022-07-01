import { useEffect, useState } from "react";
import { auth, database } from "../firebase";

const useCheckUserInfo = (userId: string) => {
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    if (userId) {
      const onUserFullName = database
        .ref(`/users/${userId}/personal/fullName`)
        .on("value", (snapshot) => {
          if (snapshot.exists) {
            setFullName(snapshot.val());
            try {
              if (
                !auth.currentUser.displayName ||
                auth.currentUser.displayName !== snapshot.val()
              )
                auth.currentUser.updateProfile({ displayName: snapshot.val() });
            } catch (error) {}
          } else setFullName("");
        });
      const onUserAvatar = database
        .ref(`/users/${userId}/personal/avatar`)
        .on("value", (snapshot) => {
          if (snapshot.exists) {
            setAvatarUrl(snapshot.val());
            try {
              if (
                !auth.currentUser.photoURL ||
                auth.currentUser.photoURL !== snapshot.val()
              )
                auth.currentUser.updateProfile({ photoURL: snapshot.val() });
            } catch (error) {}
          } else setAvatarUrl("");
        });
      return () => {
        database
          .ref(`/users/${userId}/personal/fullName`)
          .off("value", onUserFullName);
        database
          .ref(`/users/${userId}/personal/avatar`)
          .off("value", onUserAvatar);
      };
    }
  }, [userId]);

  return {
    fullName,
    avatarUrl,
  };
};

export default useCheckUserInfo;
