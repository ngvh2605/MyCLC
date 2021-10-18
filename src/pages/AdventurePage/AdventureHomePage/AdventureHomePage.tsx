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
} from "@ionic/react";
import React, { useState } from "react";
import { Route, Switch } from "react-router";
import EntryPage from "../../EntryPage";
import { alertController } from "@ionic/core";
import { database } from "../../../firebase";

const AdventureHomePage: React.FC = () => {
  const [showJoinModal, setShowJoinModal] = useState(false);

  const handleJoin = () => {
    getTeamInfo().then((data: any) => {
      console.log("data", data);
      database
        .ref()
        .child("adventure")
        .child(data.code.toLowerCase())
        .child("password")
        .get()
        .then((snapshot) => {
          console.log("pass", snapshot.val());
        });
    });
  };

  const getTeamInfo = async () => {
    return new Promise(async (resolve) => {
      const confirm = await alertController.create({
        header: "Nhập thông tin nhóm",
        backdropDismiss: false,
        inputs: [
          {
            placeholder: "Mã code nhóm",
            name: "code",
            type: "text",
          },
          {
            placeholder: "Mật khẩu nhóm",
            name: "pass",
            type: "password",
          },
        ],
        buttons: [
          {
            text: "OK",
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
