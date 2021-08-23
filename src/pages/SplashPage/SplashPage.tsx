import { IonButton, IonContent, IonPage } from "@ionic/react";
import React from "react";
import { Redirect, useHistory } from "react-router";
import { useAuth } from "../../auth";

const SplashPage: React.FC = () => {
  const history = useHistory();

  const { loggedIn } = useAuth();
  if (loggedIn) {
    return <Redirect to="/my/home" />;
  }
  return (
    <IonPage>
      <IonContent className="ion-padding">
        <IonButton
          expand="block"
          onClick={() => {
            history.push("/register");
          }}
        >
          Đăng ký
        </IonButton>
        <IonButton expand="block" routerLink="/login">
          Đăng nhập
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default SplashPage;
