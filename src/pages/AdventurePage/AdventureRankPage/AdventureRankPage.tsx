import {
  IonButtons,
  IonContent,
  IonHeader,
  IonLabel,
  IonMenuButton,
  IonPage,
  IonRouterOutlet,
  IonTab,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React from "react";
import { Route, Switch } from "react-router";
import EntryPage from "../../EntryPage";

const AdventureRankPage: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Two</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent></IonContent>
    </IonPage>
  );
};

export default AdventureRankPage;
