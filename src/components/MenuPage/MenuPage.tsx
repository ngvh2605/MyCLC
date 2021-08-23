import {
  IonAvatar,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import {
  homeSharp,
  warningSharp,
  hammerSharp,
  person,
  newspaperOutline,
  settingsOutline,
  personOutline,
} from "ionicons/icons";
import React, { useRef } from "react";
import { useHistory } from "react-router";
import "./MenuPage.scss";

const MenuPage = () => {
  const history = useHistory();
  const menuEl = useRef<HTMLIonMenuElement>(null);

  return (
    <IonMenu contentId="main" type="overlay" ref={menuEl} id="menu-page">
      <IonHeader>
        <IonToolbar>
          <IonAvatar className="ion-margin">
            <IonImg src="/assets/placeholder.png" />
          </IonAvatar>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList lines="none" className="ion-margin">
          <IonItem>
            <IonIcon icon={newspaperOutline} color="primary" slot="start" />
            <IonLabel>CLC News</IonLabel>
          </IonItem>
          <IonItem routerLink="/my/profile">
            <IonIcon icon={personOutline} color="primary" slot="start" />
            <IonLabel>Hồ sơ</IonLabel>
          </IonItem>
          <IonItem>
            <IonIcon icon={settingsOutline} color="primary" slot="start" />
            <IonLabel>Cài đặt</IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default MenuPage;
