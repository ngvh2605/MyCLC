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
} from "@ionic/react";

import { Events } from "../../models";
import EventCard from "./EventCard";
import { getEvent, getNextEvent } from "./services";
import { Storage } from "@capacitor/storage";
import { UnAuth } from "../../components/CommonUI/UnAuth";

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
  const history = useHistory();

  //todo: query total event
  const [totalEvents, setTotalEvents] = useState(0);

  const [eventsList, setEventsList] = useState<Events[]>([]);
  const [lastKey, setLastKey] = useState<number | string>(0);

  const [loading, setLoading] = useState<boolean>(false);
  const [isVerify, setIsVerify] = useState<boolean>(false);

  useEffect(() => {
    checkVerify();
  }, []);

  useEffect(() => {
    if (isVerify) fetchEvents();
  }, [isVerify]);

  const fetchMore = async () => {
    const events = await getNextEvent(lastKey, 1);
    setLastKey(events?.slice(-1)?.pop()?.endDate || lastKey);
    setEventsList([...eventsList, ...events]);
  };

  const fetchEvents = async () => {
    setLoading((p) => !p);
    const events = await getEvent(10);
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

  const checkVerify = async () => {
    const { value } = await Storage.get({ key: "verify" });
    if (value === "true") {
      setIsVerify(true);
    } else setIsVerify(false);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Sự kiện</IonTitle>
          <IonButtons
            slot="end"
            onClick={() => history.push("/my/event/ticket")}
          >
            <IonButton>
              <IonIcon icon={ticketOutline} color="primary" />
            </IonButton>
          </IonButtons>
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

          <IonFab
            hidden={
              eventsList.length > 0 ? eventsList.length >= totalEvents : true
            }
            vertical="top"
            horizontal="center"
            slot="fixed"
            className="fab-center"
          >
            <IonButton
              shape="round"
              onClick={() => {
                //setEventsList([]);
                fetchEvents();
              }}
            >
              <IonIcon icon={arrowUp} slot="start" />
              <IonLabel>Có tin mới</IonLabel>
            </IonButton>
          </IonFab>

          {!loading ? (
            eventsList.map((item, index) => (
              <EventCard event={item} key={index} />
            ))
          ) : (
            <>
              <Skeleton />
            </>
          )}

          {/* <SampleEvents /> */}
          <IonButton
            style={{
              display: "block",
              marginLeft: "auto",
              marginRight: "auto",
            }}
            fill="clear"
            hidden={false}
            onClick={() => fetchMore()}
          >
            <IonLabel>
              Đọc thêm
              <br />
              <IonIcon icon={chevronDown} />
            </IonLabel>
          </IonButton>
        </IonContent>
      ) : (
        <UnAuth />
      )}
    </IonPage>
  );
};

export default EventPage;
