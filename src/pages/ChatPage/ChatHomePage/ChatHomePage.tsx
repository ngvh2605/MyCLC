import {
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React from "react";
import { useHistory } from "react-router";

const ChatHomePage: React.FC = () => {
  const history = useHistory();
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Chat</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonItem
            onClick={() => {
              history.push({
                pathname: `/my/chat/${"chatbox"}`,
              });
            }}
          >
            <IonLabel>Chatbox</IonLabel>
          </IonItem>
          <IonItem
            onClick={() => {
              history.push({
                pathname: `/my/chat/${"travel"}`,
              });
            }}
          >
            <IonLabel>Travel</IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default ChatHomePage;
