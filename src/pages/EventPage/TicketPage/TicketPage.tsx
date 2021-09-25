import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonLabel,
  IonList,
  IonListHeader,
  IonModal,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { close, fileTray, qrCodeOutline } from "ionicons/icons";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { useAuth } from "../../../auth";
import { Events } from "../../../models";
import { getEventTicketByUserId } from "../../HomePage/services";
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
  var QRCode = require("qrcode.react");

  const [tickets, setTickets] = useState<any[]>([]);
  const [events, setEvents] = useState<Events[]>([]);

  const [showModal, setShowModal] = useState(false);

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
          <IonButtons
            slot="end"
            onClick={() => {
              setShowModal(true);
            }}
          >
            <IonButton>
              <IonIcon icon={qrCodeOutline} color="primary" />
            </IonButton>
          </IonButtons>
          <IonTitle>Sự kiện của bạn</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonListHeader color="primary">
          <IonLabel>Sự kiện sắp tới</IonLabel>
        </IonListHeader>

        <IonList className="ion-margin">
          {(() => {
            const toShow = events.filter(
              (event) => event.endDate >= moment().valueOf()
            );
            return toShow.length ? (
              toShow.map((event, index) => (
                <TicketCard
                  event={event}
                  status={tickets[index].status}
                  key={index}
                />
              ))
            ) : (
              <EmptyCard />
            );
          })()}
          <br />
        </IonList>

        <IonListHeader color="primary">
          <IonLabel>Sự kiện đã qua</IonLabel>
        </IonListHeader>
        <IonList className="ion-margin">
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

        <IonModal
          isOpen={showModal}
          cssClass="my-custom-class"
          onDidDismiss={() => setShowModal(false)}
        >
          <IonHeader>
            <IonToolbar>
              <IonTitle>Mã QR của bạn</IonTitle>
              <IonButtons slot="end" onClick={() => setShowModal(false)}>
                <IonButton>
                  <IonIcon icon={close} color="primary" />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonTitle>
              <div
                style={{ marginLeft: "auto", marginRight: "auto", width: 250 }}
              >
                <QRCode value={userId} size={250} />
              </div>
            </IonTitle>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default TicketPage;
