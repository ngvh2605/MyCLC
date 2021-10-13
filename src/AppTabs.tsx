import { IonRouterOutlet, useIonViewWillEnter } from "@ionic/react";
import React, { useState } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { useAuth } from "./auth";
import AboutPage from "./pages/AboutPage";
import AddEntryPage from "./pages/AddEntryPage";
import AllEntryPage from "./pages/AllEntryPage";
import EntryPage from "./pages/EntryPage";
import EventPage from "./pages/EventPage";
import TicketPage from "./pages/EventPage/TicketPage";
import ViewEventPage from "./pages/EventPage/ViewEventPage";
import HomePage from "./pages/HomePage";
import AddNewsPage from "./pages/HomePage/AddNewsPage";
import ViewNewsPage from "./pages/HomePage/ViewNewsPage";
import ManagePage from "./pages/ManagePage";
import AddEventPage from "./pages/ManagePage/AddEventPage";
import EventRegisterList from "./pages/ManagePage/EventRegisterList";
import NotFoundPage from "./pages/NotFoundPage";
import ProfilePage from "./pages/ProfilePage";
import AvatarPage from "./pages/ProfilePage/AvatarPage";
import EmailVerify from "./pages/ProfilePage/EmailVerify";
import PersonalInfo from "./pages/ProfilePage/PersonalInfo";
import PhoneVerify from "./pages/ProfilePage/PhoneVerify";
import SettingsPage from "./pages/SettingsPage";
import TimetablePage from "./pages/TimetablePage";
import UserPage from "./pages/UserPage";
import { Storage } from "@capacitor/storage";
import CLC2UniPage from "./pages/CLC2UniPage";
import useCheckUserInfo from "./common/useCheckUserInfo";

const AppTabs: React.FC = () => {
  const { loggedIn, userId } = useAuth();
  const { allowCreateNews, allowCreateEvent } = useCheckUserInfo(userId);

  if (!loggedIn) {
    return <Redirect to="/index" />;
  }
  return (
    <Switch>
      <Route path="/my/clc2uni" component={CLC2UniPage}></Route>
      <Route exact path="/my/home">
        <HomePage />
      </Route>
      {allowCreateNews && (
        <Route path="/my/home/add">
          <Switch>
            <Route exact path="/my/home/add">
              <AddNewsPage />
            </Route>
            <Route exact path="/my/home/add/:id">
              <AddNewsPage />
            </Route>
          </Switch>
        </Route>
      )}
      <Route exact path="/my/home/view/:id">
        <ViewNewsPage />
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
      <Route exact path="/my/profile/avatar">
        <AvatarPage />
      </Route>
      <Route exact path="/my/event">
        <EventPage />
      </Route>
      <Route exact path="/my/event/view">
        <ViewEventPage />
      </Route>
      <Route exact path="/my/event/view/:id">
        <ViewEventPage />
      </Route>
      <Route exact path="/my/event/ticket">
        <TicketPage />
      </Route>
      <Route exact path="/my/about">
        <AboutPage />
      </Route>
      {allowCreateEvent && (
        <Route path="/my/manage">
          <Switch>
            <Route exact path="/my/manage">
              <ManagePage />
            </Route>
            <Route exact path="/my/manage/add">
              <AddEventPage />
            </Route>
            <Route exact path="/my/manage/add/:id">
              <AddEventPage />
            </Route>
            <Route exact path="/my/manage/list/:id">
              <EventRegisterList />
            </Route>
          </Switch>
        </Route>
      )}

      <Route exact path="/my/timetable">
        <TimetablePage />
      </Route>

      <Route exact path="/my/user">
        <UserPage />
      </Route>
      <Route exact path="/my/user/:id">
        <UserPage />
      </Route>

      <Route path="*">
        <NotFoundPage />
      </Route>
    </Switch>
  );
};

export default AppTabs;
