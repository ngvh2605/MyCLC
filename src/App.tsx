import {
  IonApp,
  IonLoading,
  IonRouterOutlet,
  IonSplitPane,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import AppTabs from "./AppTabs";
import { AuthContext, useAuthInit } from "./auth";
import MenuPage from "./components/MenuPage";

import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import RegisterPage from "./pages/RegisterPage";
import SplashPage from "./pages/SplashPage";

const App: React.FC = () => {
  const { loading, auth } = useAuthInit();
  if (loading) {
    return <IonLoading isOpen />;
  }
  console.log(`rendering App with auth:`, auth);
  return (
    <IonApp>
      <MenuPage />
      <AuthContext.Provider value={auth}>
        <IonReactRouter>
          <Switch>
            <IonRouterOutlet id="main">
              <Route exact path="/login">
                <LoginPage />
              </Route>
              <Route exact path="/index">
                <SplashPage />
              </Route>
              <Route exact path="/register">
                <RegisterPage />
              </Route>
              <Route path="/my">
                <AppTabs />
              </Route>
              <Redirect exact path="/" to="/my/home" />
              <Route>
                <NotFoundPage />
              </Route>
            </IonRouterOutlet>
          </Switch>
        </IonReactRouter>
      </AuthContext.Provider>
    </IonApp>
  );
};

export default App;
