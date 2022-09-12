import {
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import {
  flagOutline,
  homeOutline,
  ribbonOutline,
  trophyOutline,
} from "ionicons/icons";
import React from "react";
import { Redirect, Route } from "react-router";
import { useAuth } from "../../auth";
import NotFoundPage from "../NotFoundPage";
import AdventureHomePage from "./AdventureHomePage";
import AdventureMarkPage from "./AdventureMarkPage";
import AdventureRankPage from "./AdventureRankPage";
import AdventureTeamPage from "./AdventureTeamPage";
import useAdventureCheck from "./useAdventureCheck";

const AdventurePage: React.FC = () => {
  const { userId } = useAuth();
  const { teamId, allowMark } = useAdventureCheck(userId);

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
          render={() => (teamId ? <AdventureTeamPage /> : <NotFoundPage />)}
          exact={true}
        />
        <Route
          path="/my/adventure/mark"
          render={() => (allowMark ? <AdventureMarkPage /> : <NotFoundPage />)}
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
        {teamId && (
          <IonTabButton tab="three" href="/my/adventure/team">
            <IonIcon icon={flagOutline} />
            <IonLabel>Nhiệm vụ</IonLabel>
          </IonTabButton>
        )}
        {allowMark && (
          <IonTabButton tab="four" href="/my/adventure/mark">
            <IonIcon icon={ribbonOutline} />
            <IonLabel>Xét duyệt</IonLabel>
          </IonTabButton>
        )}
      </IonTabBar>
    </IonTabs>
  );
};

export default AdventurePage;
