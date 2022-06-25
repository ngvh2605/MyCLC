/* eslint-disable react-hooks/exhaustive-deps */
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonListHeader,
  IonModal,
  IonPage,
  IonSkeletonText,
  IonText,
  IonThumbnail,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { close, qrCodeOutline } from "ionicons/icons";
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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTickets = async () => {
      setIsLoading(true);
      const temp = await getEventTicketByUserId(userId);
      setTickets(temp.tickets);
      setEvents(temp.events);
      setIsLoading(false);
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
        <IonListHeader>Sự kiện sắp tới</IonListHeader>

        {isLoading ? (
          <TicketSkeleton />
        ) : (
          <div>
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
                    handleCancel={() => {
                      let temp = [...events];
                      temp.splice(index, 1);
                      setEvents(temp);
                    }}
                  />
                ))
              ) : (
                <EmptyUI />
              );
            })()}
          </div>
        )}

        <br />
        <hr />

        <IonListHeader>Sự kiện đã qua</IonListHeader>
        {isLoading ? (
          <TicketSkeleton />
        ) : (
          <div>
            {events.filter(function (event) {
              return moment(event.endDate).isBefore(moment().valueOf());
            }).length > 0 ? (
              events
                .filter(function (event) {
                  return moment(event.endDate).isBefore(moment().valueOf());
                })
                .sort(
                  (a, b) =>
                    moment(b.startDate).valueOf() -
                    moment(a.startDate).valueOf()
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
          </div>
        )}

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

const TicketSkeleton = () => {
  return (
    <div style={{ maxWidth: 680, margin: "0 auto" }}>
      <IonCard>
        <IonCardContent style={{ paddingLeft: 0 }}>
          <IonItem lines="none">
            <IonThumbnail slot="start">
              <IonSkeletonText animated style={{ borderRadius: 10 }} />
            </IonThumbnail>

            <div style={{ width: "100%" }} onClick={() => {}}>
              <IonText color="dark" text-wrap>
                <b style={{ fontSize: "large" }}>
                  <IonSkeletonText animated style={{ width: "20%" }} />
                </b>
              </IonText>
              <IonLabel color="medium" text-wrap>
                <p>
                  <IonSkeletonText animated style={{ width: "30%" }} />
                </p>
              </IonLabel>
              <IonLabel color="medium" text-wrap>
                <IonSkeletonText animated style={{ width: "70%" }} />
              </IonLabel>
              <IonLabel color="medium" text-wrap>
                <IonSkeletonText animated style={{ width: "50%" }} />
              </IonLabel>
            </div>
          </IonItem>
        </IonCardContent>
      </IonCard>
    </div>
  );
};

export default TicketPage;
