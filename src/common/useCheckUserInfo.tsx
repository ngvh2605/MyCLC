import { Storage } from "@capacitor/storage";
import { useEffect, useState } from "react";
import { auth, database } from "../firebase";

const useCheckUserInfo = (userId: string) => {
  const [isVerify, setIsVerify] = useState<boolean>(false);
  const [avatarVerify, setAvatarVerify] = useState<boolean>(false);

  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

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
      const onVerifyStatus = database
        .ref(`/users/${userId}/verify`)
        .on("value", (snapshot) => {
          const data = snapshot.val();
          console.log("data", data);
          if (
            data &&
            data.emailVerify &&
            data.phoneVerify &&
            data.personalInfo
          ) {
            setIsVerify(true);
            setVerifyStatus("true");
          } else {
            setIsVerify(false);
            setVerifyStatus("false");
          }
          if (data && data.avatarVerify) setAvatarVerify(true);
          else setAvatarVerify(false);
        });
      return () =>
        database.ref(`/users/${userId}/verify`).off("value", onVerifyStatus);
    }
  }, [userId]);

  const setVerifyStatus = async (status: string) => {
    await Storage.set({ key: "isVerify", value: status });
  };

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
    isVerify,
    avatarVerify,
    fullName,
    avatarUrl,
    // allowCreateEvent: status.allowCreateEvent,
    // allowCreateNews: status.allowCreateNews,
    // isLoading: status.isLoading,
    ...status,
  };
};

export default useCheckUserInfo;
