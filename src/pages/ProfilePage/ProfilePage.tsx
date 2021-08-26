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
import { useHistory } from "react-router";

interface VerifyStatus {
  emailVerify: boolean;
  phoneVerify: boolean;
  personalInfo: boolean;
  hasAvatar: boolean;
}

const ProfilePage: React.FC = () => {
  const { userId, emailVerified } = useAuth();
  const history = useHistory();
  const [verifyStatus, setVerifyStatus] = useState<VerifyStatus>({
    emailVerify: true,
    phoneVerify: true,
    personalInfo: true,
    hasAvatar: true,
  });

  useEffect(() => {
    readStatus();
  }, []);

  useEffect(() => {
    checkEmailVerify();
  }, [verifyStatus]);

  const readStatus = () => {
    const userData = database.ref();
    userData
      .child("users")
      .child(userId)
      .child("verify")
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

  const checkEmailVerify = async () => {
    if (emailVerified && !verifyStatus.emailVerify) {
      const userData = database.ref();
      await userData.child("users").child(userId).child("verify").update({
        emailVerify: true,
      });
    }
    readStatus();
  };

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
            console.log(verifyStatus);
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
            disabled={verifyStatus?.emailVerify}
            onClick={() => {
              history.push("/my/profile/email");
            }}
          >
            <IonCheckbox
              checked={verifyStatus?.emailVerify}
              hidden={!verifyStatus?.emailVerify}
              slot="end"
            />
            <IonLabel>Xác minh Email</IonLabel>
          </IonItem>
          <IonItem
            detail={!verifyStatus?.phoneVerify}
            disabled={verifyStatus?.phoneVerify}
            onClick={() => {
              history.push("/my/profile/phone");
            }}
          >
            <IonCheckbox
              checked={verifyStatus?.phoneVerify}
              hidden={!verifyStatus?.phoneVerify}
              slot="end"
            />
            <IonLabel>Xác minh Số điện thoại</IonLabel>
          </IonItem>
          <IonItem
            detail={!verifyStatus?.personalInfo}
            disabled={verifyStatus?.personalInfo}
            onClick={() => {
              history.push("/my/profile/personal");
            }}
          >
            <IonCheckbox
              checked={verifyStatus?.personalInfo}
              hidden={!verifyStatus?.personalInfo}
              slot="end"
            />
            <IonLabel>Xác thực danh tính</IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default ProfilePage;
