import {
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import { homeOutline, peopleOutline } from "ionicons/icons";
import React from "react";
import { Redirect, Route } from "react-router";
import OnePage from "./OnePage";
import TwoPage from "./TwoPage";

const CLC2UniPage: React.FC = () => {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Redirect exact path="/my/clc2uni" to="/my/clc2uni/one" />
        <Route path="/my/clc2uni/one" render={() => <OnePage />} exact={true} />
        <Route path="/my/clc2uni/two" render={() => <TwoPage />} exact={true} />
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="one" href="/my/clc2uni/one">
          <IonIcon icon={homeOutline} />
          <IonLabel>One</IonLabel>
        </IonTabButton>
        <IonTabButton tab="two" href="/my/clc2uni/two">
          <IonIcon icon={peopleOutline} />
          <IonLabel>Two</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default CLC2UniPage;
