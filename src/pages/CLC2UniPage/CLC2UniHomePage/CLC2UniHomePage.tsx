import {
  IonButtons,
  IonCard,
  IonContent,
  IonHeader,
  IonImg,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React from "react";

const CLC2UniHomePage: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>CLC2Uni</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <IonCard>
            <IonImg src="https://i.ibb.co/19hLVJj/246739180-3928149053955342-1703980696318181476-n.png" />
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default CLC2UniHomePage;
