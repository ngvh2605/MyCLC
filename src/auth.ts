import { FirebaseAnalytics } from "@capacitor-community/firebase-analytics";
import LogRocket from "logrocket";
import React, { useContext, useEffect, useState } from "react";
import { auth as firebaseAuth, remoteConfig } from "./firebase";
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

export function useAuthInit(): AuthInit {
  const [authInit, setAuthInit] = useState<AuthInit>({ loading: true });
  useEffect(() => {
    const initializeLogrocket = () => {
      try {
        remoteConfig.fetchAndActivate().then(() => {
          console.log("remote config", remoteConfig.getAll());

          LogRocket.init(remoteConfig.getString("logrocket"));
        });
      } catch (err) {
        console.log("LogRocket error: ", err);
      }
    };
    initializeLogrocket();

    return firebaseAuth.onAuthStateChanged((firebaseUser) => {
      console.log("user data", firebaseUser);
      const auth = firebaseUser
        ? {
            loggedIn: true,
            userId: firebaseUser.uid,
            userEmail: firebaseUser.email,
            emailVerified: firebaseUser.emailVerified,
          }
        : { loggedIn: false };
      setAuthInit({ loading: false, auth });
      if (!!firebaseUser) {
        LogRocket.identify(firebaseUser.uid, {
          email: firebaseUser.email,
          name: firebaseUser.displayName,
        });

        FirebaseAnalytics.setUserId({
          userId: firebaseUser.uid,
        });
      }
    });
  }, []);
  return authInit;
}
