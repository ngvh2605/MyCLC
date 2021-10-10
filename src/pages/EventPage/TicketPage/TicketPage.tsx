/* eslint-disable react-hooks/exhaustive-deps */
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItemDivider,
  IonLabel,
  IonList,
  IonModal,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { close, fileTray, qrCodeOutline } from "ionicons/icons";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../../auth";
import { EmptyUI } from "../../../components/CommonUI/EmptyUI";
import { Events } from "../../../models";
import { getEventTicketByUserId } from "../../HomePage/services";
import TicketCard from "./TicketCard";

const TicketPage: React.FC = () => {
  const { userId } = useAuth();
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
        <IonItemDivider
          color="primary"
          style={{ paddingTop: 6, paddingBottom: 6 }}
        >
          <IonLabel className="ion-padding-horizontal">
            Sự kiện sắp tới
          </IonLabel>
        </IonItemDivider>
        <IonList className="ion-margin-horizontal">
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
              <EmptyUI />
            );
          })()}
          <br />
        </IonList>
        <br />
        <IonItemDivider
          color="primary"
          style={{ paddingTop: 6, paddingBottom: 6 }}
        >
          <IonLabel className="ion-padding-horizontal">Sự kiện đã qua</IonLabel>
        </IonItemDivider>
        <IonList className="ion-margin-horizontal">
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
            <EmptyUI />
          )}
        </IonList>
        <br />
        <br />
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
