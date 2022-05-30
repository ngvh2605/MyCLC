import {
  IonButtons,
  IonCard,
  IonCardContent,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonImg,
  IonLabel,
  IonMenuButton,
  IonPage,
  IonRow,
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
        <IonGrid>
          <IonRow>
            <IonCol size="6">
              <IonCard className="ion-no-margin" style={{ margin: 8 }}>
                <IonImg src="https://scontent.fcbr1-1.fna.fbcdn.net/v/t39.30808-6/277738715_2137464263097110_7884089031801519933_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=e3f864&_nc_ohc=52GWwWZV9U8AX_DomdA&_nc_ht=scontent.fcbr1-1.fna&oh=00_AT_lP152CAKi_RVP_M5o_hL8TNXbeYwuUFZCvgUQOYflPQ&oe=6299D496" />
                <IonCardContent>
                  <IonLabel>Hello how are you 0</IonLabel>
                </IonCardContent>
              </IonCard>
            </IonCol>
            <IonCol size="6">
              <IonCard className="ion-no-margin" style={{ margin: 8 }}>
                <IonImg src="https://scontent.fcbr1-1.fna.fbcdn.net/v/t39.30808-6/277738715_2137464263097110_7884089031801519933_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=e3f864&_nc_ohc=52GWwWZV9U8AX_DomdA&_nc_ht=scontent.fcbr1-1.fna&oh=00_AT_lP152CAKi_RVP_M5o_hL8TNXbeYwuUFZCvgUQOYflPQ&oe=6299D496" />
                <IonCardContent>
                  <IonLabel>Hello how are you 1</IonLabel>
                </IonCardContent>
              </IonCard>
            </IonCol>
            <IonCol size="6">
              <IonCard className="ion-no-margin" style={{ margin: 8 }}>
                <IonImg src="https://scontent.fcbr1-1.fna.fbcdn.net/v/t39.30808-6/277738715_2137464263097110_7884089031801519933_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=e3f864&_nc_ohc=52GWwWZV9U8AX_DomdA&_nc_ht=scontent.fcbr1-1.fna&oh=00_AT_lP152CAKi_RVP_M5o_hL8TNXbeYwuUFZCvgUQOYflPQ&oe=6299D496" />
                <IonCardContent>
                  <IonLabel>Hello how are you 2</IonLabel>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default CertificatePage;
