import { arrowUp, chevronDown, ticketOutline } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import { RefresherEventDetail } from "@ionic/core";
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonContent,
  IonFab,
  IonHeader,
  IonIcon,
  IonLabel,
  IonMenuButton,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonSkeletonText,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
} from "@ionic/react";

import { Events } from "../../models";
import EventCard from "./EventCard";
import { getEvent, getNextEvent } from "./services";
import { Storage } from "@capacitor/storage";
import { UnAuth } from "../../components/CommonUI/UnAuth";
import { EmptyUI } from "../../components/CommonUI/EmptyUI";
import useCheckUserInfo from "../../common/useCheckUserInfo";
import { useAuth } from "../../auth";

const Skeleton = () => (
  <IonCard>
    <div>
      <IonSkeletonText
        animated
        style={{ height: 200, width: "100%", margin: 0 }}
      />
    </div>
    <IonCardContent>
      <IonSkeletonText animated style={{ width: "100%", height: 16 }} />
      <IonSkeletonText animated style={{ width: "100%", height: 16 }} />
      <IonSkeletonText animated style={{ width: "100%", height: 16 }} />
      <IonSkeletonText animated style={{ width: "30%", height: 16 }} />
    </IonCardContent>
  </IonCard>
);

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

  const refreshEvents = (event: CustomEvent<RefresherEventDetail>) => {
    fetchEvents();
    setTimeout(() => {
      event.detail.complete();
    }, 2000);
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
        <IonContent className="ion-padding">
          <IonRefresher slot="fixed" onIonRefresh={refreshEvents}>
            <IonRefresherContent
              style={{ marginTop: 10 }}
              pullingIcon={chevronDown}
              pullingText="Kéo xuống để làm mới"
            ></IonRefresherContent>
          </IonRefresher>

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
              <Skeleton />
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
