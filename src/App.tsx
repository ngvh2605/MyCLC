import { IonApp, IonLoading, IonRouterOutlet, setupConfig } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import AppTabs from "./AppTabs";
import { AuthContext, useAuthInit } from "./auth";
import MenuPage from "./components/MenuPage";
import FramePage from "./pages/FramePage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import RegisterPage from "./pages/RegisterPage";
import SplashPage from "./pages/SplashPage";

const App: React.FC = () => {
  const { loading, auth } = useAuthInit();
  setupConfig({ mode: "ios" });

  if (loading) {
    return <IonLoading isOpen />;
  }
  console.log(`rendering App with auth:`, auth);

  // LogRocket.init("clc-multimedia/myclc");

  return (
    <IonApp>
      <AuthContext.Provider value={auth}>
        <IonReactRouter>
          <MenuPage />
          <IonRouterOutlet id="main">
            <Switch>
              <Redirect exact path="/" to="/my/home" />
              <Route exact path="/login">
                <LoginPage />
              </Route>
              <Route exact path="/index">
                <SplashPage />
              </Route>
              <Route exact path="/register">
                <RegisterPage />
              </Route>

              <Route path="/frame">
                <FramePage />
              </Route>

              <Route path="/my">
                <AppTabs />
              </Route>
              <Route>
                <NotFoundPage />
              </Route>
            </Switch>
          </IonRouterOutlet>
        </IonReactRouter>
      </AuthContext.Provider>
    </IonApp>
  );
};

export default App;
