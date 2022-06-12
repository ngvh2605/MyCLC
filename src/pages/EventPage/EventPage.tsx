import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { ticketOutline } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../../auth";
import useCheckUserInfo from "../../common/useCheckUserInfo";
import { EmptyUI } from "../../components/CommonUI/EmptyUI";
import RefresherItem from "../../components/CommonUI/RefresherItem";
import { UnAuth } from "../../components/CommonUI/UnAuth";
import { Events } from "../../models";
import EventCard from "./EventCard";
import { EventSkeleton } from "./EventCard/EventCard";
import { getEvent } from "./services";

const EventPage: React.FC = () => {
  const { userId } = useAuth();
  const { isVerify } = useCheckUserInfo(userId);
  const history = useHistory();

  const [eventsList, setEventsList] = useState<Events[]>([]);
  const [lastKey, setLastKey] = useState<number | string>(0);

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isVerify) fetchEvents();
  }, [isVerify]);

  const fetchEvents = async () => {
    setLoading((p) => !p);
    const events = await getEvent();
    if (events.length > 0) {
      setLastKey(events.slice(-1).pop().endDate || 0);
      setEventsList(events);
    }
    console.log(events);
    setLoading((p) => !p);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Sự kiện</IonTitle>
          {isVerify && (
            <IonButtons
              slot="end"
              onClick={() => history.push("/my/event/ticket")}
            >
              <IonButton>
                <IonIcon icon={ticketOutline} color="primary" />
              </IonButton>
            </IonButtons>
          )}
        </IonToolbar>
      </IonHeader>
      {isVerify ? (
        <IonContent>
          <RefresherItem
            handleRefresh={() => {
              fetchEvents();
            }}
          />

          {!loading ? (
            eventsList && eventsList.length > 0 ? (
              eventsList
                .sort((a, b) => a.startDate - b.startDate)
                .map((item, index) => <EventCard event={item} key={index} />)
            ) : (
              <EmptyUI />
            )
          ) : (
            <>
              <EventSkeleton />
            </>
          )}
        </IonContent>
      ) : (
        <UnAuth />
      )}
    </IonPage>
  );
};

export default EventPage;
