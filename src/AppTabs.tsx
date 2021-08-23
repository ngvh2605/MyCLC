import {
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import { home as homeIcon, settings as settingsIcon } from "ionicons/icons";
import React from "react";
import { Redirect, Route } from "react-router-dom";
import { useAuth } from "./auth";
import HomePage from "./pages/HomePage";
import AddEntryPage from "./pages/AddEntryPage";
import EntryPage from "./pages/EntryPage";
import AllEntryPage from "./pages/AllEntryPage";
import SettingsPage from "./pages/SettingsPage";

const AppTabs: React.FC = () => {
  const { loggedIn } = useAuth();
  if (!loggedIn) {
    return <Redirect to="/index" />;
  }
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/my/home">
          <HomePage />
        </Route>
        <Route exact path="/my/entries">
          <AllEntryPage />
        </Route>
        <Route exact path="/my/entries/add">
          <AddEntryPage />
        </Route>
        <Route exact path="/my/entries/view/:id">
          <EntryPage />
        </Route>
        <Route exact path="/my/settings">
          <SettingsPage />
        </Route>
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="home" href="/my/home">
          <IonIcon icon={homeIcon} />
          <IonLabel>Home</IonLabel>
        </IonTabButton>
        <IonTabButton tab="settings" href="/my/settings">
          <IonIcon icon={settingsIcon} />
          <IonLabel>Settings</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default AppTabs;
