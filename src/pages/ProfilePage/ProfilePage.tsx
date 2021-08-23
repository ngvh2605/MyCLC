import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonCheckbox,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonMenuButton,
  IonModal,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { mailOutline } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { database } from "../../firebase";
import { useAuth } from "../../auth";

interface VerifyStatus {
  emailVerify: boolean;
  phoneVerify: boolean;
  personalInfo: boolean;
  hasAvatar: boolean;
}

const ProfilePage: React.FC = () => {
  const { userId } = useAuth();

  const [verifyStatus, setVerifyStatus] = useState<VerifyStatus>();

  const readStatus = () => {
    const userData = database.ref();
    userData
      .child("users")
      .child(userId)
      .get()
      .then((snapshot) => {
        if (snapshot.exists()) {
          setVerifyStatus(snapshot.val());
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    readStatus();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Hồ sơ</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonButton
          onClick={() => {
            readStatus();
          }}
        >
          Read
        </IonButton>
        <IonAvatar
          className="ion-margin"
          style={{
            width: 100,
            height: 100,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <IonImg src="/assets/placeholder.png" />
        </IonAvatar>
        <p style={{ textAlign: "center", fontSize: "large" }}>
          <b>CLC Multimedia</b>
        </p>
        <p>Xác minh</p>
        <IonList lines="none">
          <IonItem
            detail={!verifyStatus?.emailVerify}
            routerLink="/my/profile/email"
          >
            <IonCheckbox
              disabled={verifyStatus?.emailVerify}
              checked={verifyStatus?.emailVerify}
              hidden={!verifyStatus?.emailVerify}
              slot="end"
            />
            <IonLabel>Xác minh Email</IonLabel>
          </IonItem>
          <IonItem detail={!verifyStatus?.phoneVerify}>
            <IonCheckbox
              disabled={verifyStatus?.phoneVerify}
              checked={verifyStatus?.phoneVerify}
              hidden={!verifyStatus?.phoneVerify}
              slot="end"
            />
            <IonLabel>Xác minh Số điện thoại</IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default ProfilePage;
