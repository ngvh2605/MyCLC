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
import {
  flagOutline,
  homeOutline,
  peopleOutline,
  trophyOutline,
} from "ionicons/icons";
import React from "react";
import { Redirect, Route, Switch } from "react-router";
import EntryPage from "../EntryPage";
import AdventureHomePage from "./AdventureHomePage";
import AdventureRankPage from "./AdventureRankPage";
import AdventureTeamPage from "./AdventureTeamPage";

const AdventurePage: React.FC = () => {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Redirect exact path="/my/adventure" to="/my/adventure/home" />
        <Route
          path="/my/adventure/home"
          render={() => <AdventureHomePage />}
          exact={true}
        />
        <Route
          path="/my/adventure/rank"
          render={() => <AdventureRankPage />}
          exact={true}
        />
        <Route
          path="/my/adventure/team"
          render={() => <AdventureTeamPage />}
          exact={true}
        />
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="one" href="/my/adventure/home">
          <IonIcon icon={homeOutline} />
          <IonLabel>Trang chủ</IonLabel>
        </IonTabButton>
        <IonTabButton tab="two" href="/my/adventure/rank">
          <IonIcon icon={trophyOutline} />
          <IonLabel>Xếp hạng</IonLabel>
        </IonTabButton>
        <IonTabButton tab="three" href="/my/adventure/team">
          <IonIcon icon={flagOutline} />
          <IonLabel>Nhiệm vụ</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default AdventurePage;
