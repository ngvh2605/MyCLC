import {
  IonApp,
  IonContent,
  IonHeader,
  IonIcon,
  IonLabel,
  IonPage,
  IonRouterOutlet,
  IonTab,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonTitle,
} from "@ionic/react";
import { homeOutline, peopleOutline } from "ionicons/icons";
import React from "react";
import { Redirect, Route, Switch } from "react-router";
import EntryPage from "../EntryPage";
import OnePage from "./AdventureHomePage";
import TwoPage from "./TwoPage";

const AdventurePage: React.FC = () => {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Redirect exact path="/my/adventure" to="/my/adventure/one" />
        <Route
          path="/my/adventure/one"
          render={() => <OnePage />}
          exact={true}
        />
        <Route
          path="/my/adventure/two"
          render={() => <TwoPage />}
          exact={true}
        />
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="one" href="/my/adventure/one">
          <IonIcon icon={homeOutline} />
          <IonLabel>One</IonLabel>
        </IonTabButton>
        <IonTabButton tab="two" href="/my/adventure/two">
          <IonIcon icon={peopleOutline} />
          <IonLabel>Two</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default AdventurePage;
