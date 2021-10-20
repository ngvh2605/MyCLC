import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonLabel,
  IonMenuButton,
  IonModal,
  IonPage,
  IonRouterOutlet,
  IonTab,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonTitle,
  IonToolbar,
  useIonToast,
} from "@ionic/react";
import React, { useState } from "react";
import { Route, Switch } from "react-router";
import EntryPage from "../../EntryPage";
import { alertController } from "@ionic/core";
import { database, firestore } from "../../../firebase";

const AdventureHomePage: React.FC = () => {
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [presentToast] = useIonToast();

  const handleJoin = () => {
    getTeamInfo().then((data: any) => {
      console.log("data", data);
      firestore
        .collection("adventure")
        .doc(data.code)
        .get()
        .then((doc) => {
          console.log(doc.data());
          const data = doc.data();
          if (!data) {
            presentToast({
              message: "Vui lòng kiểm tra lại thông tin nhóm",
              duration: 2000,
              color: "danger",
            });
          }
        });
    });
  };

  const getTeamInfo = async () => {
    return new Promise(async (resolve) => {
      const confirm = await alertController.create({
        header: "Nhập thông tin nhóm",
        backdropDismiss: true,
        inputs: [
          {
            placeholder: "Mã code nhóm",
            name: "code",
          },
          {
            placeholder: "Mã Pin (4 chữ số)",
            name: "pass",
          },
        ],
        buttons: [
          {
            text: "Tham gia",
            handler: (data) => {
              return resolve(data);
            },
          },
        ],
      });

      await confirm.present();
    });
  };
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>One</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonButton onClick={() => handleJoin()}>Join</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default AdventureHomePage;
