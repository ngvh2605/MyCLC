import {
  IonContent,
  IonHeader,
  IonLabel,
  IonPage,
  IonRouterOutlet,
  IonTab,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonTitle,
} from "@ionic/react";
import React from "react";
import { Route, Switch } from "react-router";
import EntryPage from "../../EntryPage";

const OnePage: React.FC = () => {
  return (
    <>
      <IonHeader>
        <IonTitle>One</IonTitle>
      </IonHeader>
      <IonContent></IonContent>
    </>
  );
};

export default OnePage;
