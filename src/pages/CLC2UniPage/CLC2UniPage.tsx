import {
  IonApp,
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
import EntryPage from "../EntryPage";
import OnePage from "./OnePage";
import TwoPage from "./TwoPage";

const CLC2UniPage: React.FC = () => {
  return (
    <IonPage>
      <IonTabs>
        <IonRouterOutlet>
          <Switch>
            <Route path="/my/clc2uni/one" component={OnePage}></Route>
            <Route path="/my/clc2uni/two" component={TwoPage}></Route>
          </Switch>
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="one" href="/my/clc2uni/one">
            <IonLabel>One</IonLabel>
          </IonTabButton>
          <IonTabButton tab="two" href="/my/clc2uni/two">
            <IonLabel>Two</IonLabel>
          </IonTabButton>
        </IonTabBar>
        <IonTab tab={"one"}>
          <IonHeader>
            <IonTitle>ABC</IonTitle>
          </IonHeader>
          <IonContent></IonContent>
        </IonTab>
        <IonTab tab={"two"}>
          <IonHeader>
            <IonTitle>ABC</IonTitle>
          </IonHeader>
          <IonContent></IonContent>
        </IonTab>
      </IonTabs>
    </IonPage>
  );
};

export default CLC2UniPage;
