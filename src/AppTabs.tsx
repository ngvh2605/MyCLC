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
import ProfilePage from "./pages/ProfilePage";
import EmailVerify from "./pages/ProfilePage/EmailVerify";
import PhoneVerify from "./pages/ProfilePage/PhoneVerify";
import PersonalInfo from "./pages/ProfilePage/PersonalInfo";
import EventPage from "./pages/EventPage";
import AboutPage from "./pages/AboutPage";

const AppTabs: React.FC = () => {
  const { loggedIn } = useAuth();
  if (!loggedIn) {
    return <Redirect to="/index" />;
  }
  return (
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
      <Route exact path="/my/profile">
        <ProfilePage />
      </Route>
      <Route exact path="/my/profile/email">
        <EmailVerify />
      </Route>
      <Route exact path="/my/profile/phone">
        <PhoneVerify />
      </Route>
      <Route exact path="/my/profile/personal">
        <PersonalInfo />
      </Route>

      <Route exact path="/my/event">
        <EventPage />
      </Route>

      <Route exact path="/my/about">
        <AboutPage />
      </Route>
    </IonRouterOutlet>
  );
};

export default AppTabs;
