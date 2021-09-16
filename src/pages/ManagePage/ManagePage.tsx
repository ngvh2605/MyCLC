import {
  IonButton,
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
import { add, chevronDown, mailUnreadOutline } from "ionicons/icons";
import "moment/locale/vi";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { useAuth } from "../../auth";
import { firestore } from "../../firebase";
import { Events, toEvents } from "../../models";
import ManageCard from "./ManageCard";
import "./ManagePage.scss";
import { RefresherEventDetail } from "@ionic/core";
import moment from "moment";

const ManagePage: React.FC = () => {
  const { userId } = useAuth();
  const history = useHistory();

  const [events, setEvents] = useState<Events[]>();
  const [segment, setSegment] = useState("new");

  useEffect(() => {
    fetchEvent();
  }, []);

  const fetchEvent = async (event?: CustomEvent<RefresherEventDetail>) => {
    const { docs } = await firestore
      .collection("events")
      .where("author", "==", userId)
      .orderBy("startDate", "desc")
      .limit(10)
      .get();

    console.log(docs.map(toEvents));
    setEvents(docs.map(toEvents));

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

      <IonContent className="ion-padding">
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
        {events &&
          (segment === "new"
            ? events
                .filter(function (e) {
                  return e.endDate >= moment().valueOf();
                })
                .sort(
                  (a, b) =>
                    moment(a.startDate).valueOf() -
                    moment(b.startDate).valueOf()
                )
                .map((item, index) => (
                  <ManageCard event={item} key={index} allowEdit={true} />
                ))
            : events
                .filter(function (e) {
                  return e.endDate < moment().valueOf();
                })
                .sort(
                  (a, b) =>
                    moment(b.startDate).valueOf() -
                    moment(a.startDate).valueOf()
                )
                .map((item, index) => (
                  <ManageCard event={item} key={index} allowEdit={false} />
                )))}

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
