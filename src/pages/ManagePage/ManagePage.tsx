import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { mailUnreadOutline } from "ionicons/icons";
import "moment/locale/vi";
import React from "react";
import { useAuth } from "../../auth";
import "./ManagePage.scss";

const ManagePage: React.FC = () => {
  const { userId } = useAuth();

  return (
    <IonPage id="manage-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Quản lý</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => {}}>
              <IonIcon icon={mailUnreadOutline} color="primary" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding"></IonContent>
    </IonPage>
  );
};

export default ManagePage;
