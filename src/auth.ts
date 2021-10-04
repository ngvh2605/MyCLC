import React, { useContext, useEffect, useState } from "react";
import { auth as firebaseAuth, database } from "./firebase";
import { Storage } from "@capacitor/storage";
interface Auth {
  loggedIn: boolean;
  userId?: string;
  userEmail?: string;
  emailVerified?: boolean;
}

interface AuthInit {
  loading: boolean;
  auth?: Auth;
}

export const AuthContext = React.createContext<Auth>({ loggedIn: false });

export function useAuth(): Auth {
  return useContext(AuthContext);
}

const writeToStorage = async (key: string, value: string) => {
  await Storage.set({ key, value });
};
const updateEmailVerify = async (userId: string) => {
  const userData = database.ref();
  await userData.child("users").child(userId).child("verify").update({
    emailVerify: true,
  });
};

const readStatus = (userId: string, emailVerified: boolean) => {
  const userData = database.ref().child("users").child(userId);
  userData.child("verify").on("value", (snapshot) => {
    const data = snapshot.val();
    console.log(data);
    writeToStorage("emailVerify", data && data.emailVerify ? "true" : "false");
    writeToStorage("phoneVerify", data && data.phoneVerify ? "true" : "false");
    writeToStorage(
      "personalInfo",
      data && data.personalInfo ? "true" : "false"
    );
    writeToStorage("hasAvatar", data && data.hasAvatar ? "true" : "false");
    writeToStorage(
      "verify",
      data && data.emailVerify && data.phoneVerify && data.personalInfo
        ? "true"
        : "false"
    );

    if (emailVerified && (!data || !data.emailVerify)) {
      updateEmailVerify(userId);
    }
  });
};

const readAuth = (userId: string) => {
  database
    .ref()
    .child("auth")
    .child(userId)
    .once("value")
    .then((snapshot) => {
      const data = snapshot.val();
      writeToStorage("createNews", data && data.createNews ? "true" : "false");
      writeToStorage(
        "createEvent",
        data && data.createEvent ? "true" : "false"
      );
    });
};

export function useAuthInit(): AuthInit {
  const [authInit, setAuthInit] = useState<AuthInit>({ loading: true });
  useEffect(() => {
    return firebaseAuth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        readStatus(firebaseUser.uid, firebaseUser.emailVerified);
        readAuth(firebaseUser.uid);
      }
      const auth = firebaseUser
        ? {
            loggedIn: true,
            userId: firebaseUser.uid,
            userEmail: firebaseUser.email,
            emailVerified: firebaseUser.emailVerified,
          }
        : { loggedIn: false };
      setAuthInit({ loading: false, auth });
    });
  }, []);
  return authInit;
}
