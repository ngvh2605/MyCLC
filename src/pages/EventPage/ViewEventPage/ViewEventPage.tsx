import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router";
import { useAuth } from "../../../auth";
import { Events, News } from "../../../models";

interface stateType {
  event: Events;
  authorInfo: any;
  isBuy: boolean;
}

const ViewEventPage: React.FC = () => {
  const { userId } = useAuth();
  const location = useLocation<stateType>();

  const history = useHistory();

  const [event, setEvent] = useState<Events>();
  const [authorInfo, setAuthorInfo] = useState<any>({});
  const [isBuy, setIsBuy] = useState<boolean>(false);

  useEffect(() => {
    if (location.state) {
      try {
        setEvent({ ...location.state["event"] });
        setAuthorInfo({ ...location.state["authorInfo"] });
        setIsBuy(location.state["isBuy"]);
      } catch (err) {
        console.log(err);
      }
    }
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton text="" defaultHref="/my/home" />
          </IonButtons>
          <IonButtons slot="end"></IonButtons>
          <IonTitle>Event Name</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent></IonContent>
    </IonPage>
  );
};

export default ViewEventPage;
