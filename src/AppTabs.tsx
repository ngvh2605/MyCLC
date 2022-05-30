import { IonRouterOutlet } from "@ionic/react";
import React from "react";
import { Redirect, Route } from "react-router-dom";
import { useAuth } from "./auth";
import useCheckUserInfo from "./common/useCheckUserInfo";
import AboutPage from "./pages/AboutPage";
import AddEntryPage from "./pages/AddEntryPage";
import AdventurePage from "./pages/AdventurePage";
import AllEntryPage from "./pages/AllEntryPage";
import CLC2UniPage from "./pages/CLC2UniPage";
import EntryPage from "./pages/EntryPage";
import EventPage from "./pages/EventPage";
import TicketPage from "./pages/EventPage/TicketPage";
import ViewEventPage from "./pages/EventPage/ViewEventPage";
import HomePage from "./pages/HomePage";
import AddNewsPage from "./pages/HomePage/AddNewsPage";
import ViewNewsPage from "./pages/HomePage/ViewNewsPage";
import In2CLCPage from "./pages/In2CLC/In2CLC";
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
import ChatPage from "./pages/ChatPage/index";
import ChatHomePage from "./pages/ChatPage/ChatHomePage";
import FramePage from "./pages/FramePage";
import CertificatePage from "./pages/CertificatePage/CertificatePage";

const AppTabs: React.FC = () => {
  const { loggedIn, userId } = useAuth();
  const { allowCreateNews, allowCreateEvent } = useCheckUserInfo(userId);

  if (!loggedIn) {
    return <Redirect to="/index" />;
  }

  return (
    <IonRouterOutlet>
      <Route path="/my/frame">
        <FramePage />
      </Route>

      <Route path="/my/certi">
        <CertificatePage />
      </Route>

      <Route path="/my/clc2uni" component={CLC2UniPage}></Route>
      <Route path="/my/in2clc" component={In2CLCPage}></Route>

      <Route path="/my/adventure" component={AdventurePage}></Route>
      <Route exact path="/my/home">
        <HomePage />
      </Route>

      <Route exact path="/my/home/add">
        {allowCreateNews ? <AddNewsPage /> : <NotFoundPage />}
      </Route>
      <Route exact path="/my/home/add/:id">
        {allowCreateNews ? <AddNewsPage /> : <NotFoundPage />}
      </Route>

      <Route exact path="/my/chat">
        <ChatHomePage />
      </Route>
      <Route exact path="/my/chat/:id">
        <ChatPage />
      </Route>

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

      <Route exact path="/my/manage">
        {allowCreateEvent ? <ManagePage /> : <NotFoundPage />}
      </Route>
      <Route exact path="/my/manage/add">
        {allowCreateEvent ? <AddEventPage /> : <NotFoundPage />}
      </Route>
      <Route exact path="/my/manage/add/:id">
        {allowCreateEvent ? <AddEventPage /> : <NotFoundPage />}
      </Route>
      <Route exact path="/my/manage/list/:id">
        {allowCreateEvent ? <EventRegisterList /> : <NotFoundPage />}
      </Route>

      <Route exact path="/my/timetable">
        <TimetablePage />
      </Route>

      <Route exact path="/my/user">
        <UserPage />
      </Route>
      <Route exact path="/my/user/:id">
        <UserPage />
      </Route>
    </IonRouterOutlet>
  );
};

export default AppTabs;
