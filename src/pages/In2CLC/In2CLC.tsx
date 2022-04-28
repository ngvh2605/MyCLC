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
import In2CLCHomePage from "./In2CLCHomePage";
import In2CLCMenteePage from "./In2CLCMenteePage";

const In2CLCPage: React.FC = () => {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Redirect exact path="/my/in2clc" to="/my/in2clc/home" />
        <Route
          path="/my/in2clc/home"
          render={() => <In2CLCHomePage />}
          exact={true}
        />
        <Route
          path="/my/in2clc/mentee"
          render={() => <In2CLCMenteePage />}
          exact={true}
        />
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="home" href="/my/in2clc/home">
          <IonIcon icon={homeOutline} />
          <IonLabel>Trang chủ</IonLabel>
        </IonTabButton>
        <IonTabButton tab="mentee" href="/my/in2clc/mentee">
          <IonIcon icon={peopleOutline} />
          <IonLabel>Mentee</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default In2CLCPage;
