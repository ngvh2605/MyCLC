/* eslint-disable react-hooks/exhaustive-deps */
import {
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonMenuButton,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { add } from "ionicons/icons";
import moment from "moment";
import "moment/locale/vi";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../auth";
import { EmptyUI } from "../../components/CommonUI/EmptyUI";
import RefresherItem from "../../components/CommonUI/RefresherItem";
import { firestore } from "../../firebase";
import { Events, toEvents } from "../../models";
import ManageCard from "./ManageCard";
import "./ManagePage.scss";

const ManagePage: React.FC = () => {
  const { t } = useTranslation();
  const { userId } = useAuth();

  const [events, setEvents] = useState<Events[]>();
  const [oldEvents, setOldEvents] = useState<Events[]>();
  const [segment, setSegment] = useState("new");

  useEffect(() => {
    fetchEvent();
  }, []);

  const fetchEvent = async () => {
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
  };

  return (
    <IonPage id="manage-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{t("Manage events")}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <RefresherItem
          handleRefresh={() => {
            fetchEvent();
          }}
        />

        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div style={{ margin: 16 }}>
            <IonSegment
              value={segment}
              onIonChange={(e) => setSegment(e.detail.value)}
              color="primary"
            >
              <IonSegmentButton value="new">
                {t("Upcoming events")}
              </IonSegmentButton>
              <IonSegmentButton value="old">
                {t("Past events")}
              </IonSegmentButton>
            </IonSegment>
          </div>
        </div>
        {segment === "new" &&
          (events && events.length > 0 ? (
            events
              .sort((a, b) => a.startDate - b.startDate)
              .map((item, index) => (
                <ManageCard event={item} key={index} allowEdit={true} />
              ))
          ) : (
            <EmptyUI />
          ))}
        {segment === "old" &&
          (oldEvents && oldEvents.length > 0 ? (
            oldEvents
              .sort((a, b) => b.startDate - a.startDate)
              .map((item, index) => (
                <ManageCard event={item} key={index} allowEdit={false} />
              ))
          ) : (
            <EmptyUI />
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
