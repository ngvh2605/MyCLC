/* eslint-disable react-hooks/exhaustive-deps */
import { RefresherEventDetail } from "@ionic/core";
import {
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonMenuButton,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { add, chevronDown } from "ionicons/icons";
import moment from "moment";
import "moment/locale/vi";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../auth";
import { firestore } from "../../firebase";
import { Events, toEvents } from "../../models";
import ManageCard from "./ManageCard";
import "./ManagePage.scss";

const ManagePage: React.FC = () => {
  const { userId } = useAuth();

  const [events, setEvents] = useState<Events[]>();
  const [oldEvents, setOldEvents] = useState<Events[]>();
  const [segment, setSegment] = useState("new");

  useEffect(() => {
    fetchEvent();
  }, []);

  const fetchEvent = async (event?: CustomEvent<RefresherEventDetail>) => {
    const { docs } = await firestore
      .collection("events")
      .where("author", "==", userId)
      .where("endDate", ">=", moment().valueOf())
      .get();

    setEvents(docs.map(toEvents));

    const { docs: oldDocs } = await firestore
      .collection("events")
      .where("author", "==", userId)
      .where("endDate", "<", moment().valueOf())
      .limit(10)
      .get();

    setOldEvents(oldDocs.map(toEvents));

    if (event) {
      setTimeout(() => {
        event.detail.complete();
      }, 2000);
    }
  };

  return (
    <IonPage id="manage-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Quản lý sự kiện</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={fetchEvent}>
          <IonRefresherContent
            style={{ marginTop: 10 }}
            pullingIcon={chevronDown}
            pullingText="Kéo xuống để làm mới"
          ></IonRefresherContent>
        </IonRefresher>
        <div style={{ margin: 16 }}>
          <IonSegment
            value={segment}
            onIonChange={(e) => setSegment(e.detail.value)}
            color="primary"
          >
            <IonSegmentButton value="new">Sự kiện sắp tới</IonSegmentButton>
            <IonSegmentButton value="old">Sự kiện đã qua</IonSegmentButton>
          </IonSegment>
        </div>
        {segment === "new"
          ? events &&
            events
              .sort((a, b) => a.startDate - b.startDate)
              .map((item, index) => (
                <ManageCard event={item} key={index} allowEdit={true} />
              ))
          : oldEvents &&
            oldEvents
              .sort((a, b) => b.startDate - a.startDate)
              .map((item, index) => (
                <ManageCard event={item} key={index} allowEdit={false} />
              ))}

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton routerLink="/my/manage/add">
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default ManagePage;
