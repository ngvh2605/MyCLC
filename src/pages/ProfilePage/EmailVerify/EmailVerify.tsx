import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { useEffect } from "react";
import { useAuth } from "../../../auth";
import { auth as firebaseAuth } from "../../../firebase";

const EmailVerify: React.FC = () => {
  const { userEmail } = useAuth();

  function sendVerifyEmail() {
    firebaseAuth.onAuthStateChanged((firebaseUser) => {
      firebaseUser
        .sendEmailVerification()
        .then(() => {
          console.log("Done");
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          console.log("Finally");
        });
    });
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>Xác minh Email</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <p style={{ textAlign: "center" }}>
          Địa chỉ Email của bạn:
          <br />
          <br />
          <b>{userEmail}</b>
        </p>
        <br />
        <br />
        <IonButton
          className="ion-margin"
          expand="block"
          onClick={() => {
            sendVerifyEmail();
          }}
        >
          Gửi mã xác minh
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default EmailVerify;
