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
import CLC2UniHomePage from "./CLC2UniHomePage";
import CLC2UniMenteePage from "./CLC2UniMenteePage";
import CLC2UniMentorPage from "./CLC2UniMentorPage";

const CLC2UniPage: React.FC = () => {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Redirect exact path="/my/clc2uni" to="/my/clc2uni/home" />
        <Route
          path="/my/clc2uni/home"
          render={() => <CLC2UniHomePage />}
          exact={true}
        />
        <Route
          path="/my/clc2uni/mentor"
          render={() => <CLC2UniMentorPage />}
          exact={true}
        />
        <Route
          path="/my/clc2uni/mentee"
          render={() => <CLC2UniMenteePage />}
          exact={true}
        />
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="home" href="/my/clc2uni/home">
          <IonIcon icon={homeOutline} />
          <IonLabel>Trang chủ</IonLabel>
        </IonTabButton>
        <IonTabButton tab="mentor" href="/my/clc2uni/mentor">
          <IonIcon icon={peopleOutline} />
          <IonLabel>Mentor</IonLabel>
        </IonTabButton>
        <IonTabButton tab="mentee" href="/my/clc2uni/mentee">
          <IonIcon icon={peopleOutline} />
          <IonLabel>Mentee</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default CLC2UniPage;
