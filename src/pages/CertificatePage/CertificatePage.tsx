import {
  IonButtons,
  IonCard,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React from "react";

const CertificatePage: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Chứng nhận</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonCard></IonCard>
      </IonContent>
    </IonPage>
  );
};

export default CertificatePage;
