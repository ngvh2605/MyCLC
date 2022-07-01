import { Storage } from "@capacitor/storage";
import { useEffect, useState } from "react";
import { database } from "../firebase";

const useCheckUserVerify = (userId: string) => {
  const [isVerify, setIsVerify] = useState<boolean>(false);
  const [avatarVerify, setAvatarVerify] = useState<boolean>(false);

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

  return {
    isVerify,
    avatarVerify,
  };
};

export default useCheckUserVerify;
