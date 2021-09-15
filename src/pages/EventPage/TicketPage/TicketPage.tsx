import { Camera, CameraResultType, CameraSource } from "@capacitor/core";
import {
  IonAlert,
  IonAvatar,
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonChip,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonImg,
  IonItem,
  IonItemDivider,
  IonLabel,
  IonList,
  IonLoading,
  IonPage,
  IonSkeletonText,
  IonThumbnail,
  IonTitle,
  IonToolbar,
  isPlatform,
} from "@ionic/react";
import { fileTray, image, ticket } from "ionicons/icons";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router";
import { useAuth } from "../../../auth";
import useUploadFile from "../../../common/useUploadFile";
import { database, firestore } from "../../../firebase";
import { Events } from "../../../models";
import { resizeImage } from "../../../utils/helpers/helpers";
import { getEventTicketByUserId } from "../../HomePage/services";
import EventCard from "../EventCard";
import TicketCard from "./TicketCard";

const EmptyCard = () => (
  <div style={{ marginTop: 10, marginBottom: 10 }}>
    <IonIcon
      icon={fileTray}
      style={{
        display: "block",
        marginLeft: "auto",
        marginRight: "auto",
        width: 100,
        height: 100,
        color: "#B5B5B5",
      }}
    />
    <IonLabel
      style={{
        display: "block",
        marginLeft: "auto",
        marginRight: "auto",
        width: "max-content",
      }}
      color="medium"
    >
      <p>Trống </p>
    </IonLabel>
  </div>
);
const TicketPage: React.FC = () => {
  const { userId } = useAuth();
  const history = useHistory();

  const [tickets, setTickets] = useState<any[]>([]);
  const [events, setEvents] = useState<Events[]>([]);

  useEffect(() => {
    const fetchTickets = async () => {
      const temp = await getEventTicketByUserId(userId);
      setTickets(temp.tickets);
      setEvents(temp.events);
    };
    fetchTickets();
  }, []);

  useEffect(() => {
    console.log(events);
  }, [events]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton text="" defaultHref="/my/event" />
          </IonButtons>
          <IonTitle>Sự kiện của bạn</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonItemDivider color="primary">
          <IonLabel>Sự kiện sắp tới</IonLabel>
        </IonItemDivider>
        <IonList>
          {events.filter(function (event) {
            return moment(event.endDate).isSameOrAfter(moment().valueOf());
          }).length > 0 ? (
            events
              .filter(function (event) {
                return moment(event.endDate).isSameOrAfter(moment().valueOf());
              })
              .sort(
                (a, b) =>
                  moment(a.startDate).valueOf() - moment(b.startDate).valueOf()
              )
              .map((event, index) => (
                <TicketCard
                  event={event}
                  status={tickets[index].status}
                  key={index}
                />
              ))
          ) : (
            <EmptyCard />
          )}
          <br />
        </IonList>

        <IonItemDivider color="primary">
          <IonLabel>Sự kiện đã qua</IonLabel>
        </IonItemDivider>
        <IonList>
          {events.filter(function (event) {
            return moment(event.endDate).isBefore(moment().valueOf());
          }).length > 0 ? (
            events
              .filter(function (event) {
                return moment(event.endDate).isBefore(moment().valueOf());
              })
              .sort(
                (a, b) =>
                  moment(b.startDate).valueOf() - moment(a.startDate).valueOf()
              )
              .map((event, index) => (
                <TicketCard
                  event={event}
                  status={tickets[index].status}
                  key={index}
                  isPast={true}
                />
              ))
          ) : (
            <EmptyCard />
          )}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default TicketPage;
