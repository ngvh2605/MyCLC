import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonLabel,
  IonMenuButton,
  IonPage,
  IonSlide,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { ticketOutline } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { useAuth } from "../../auth";
import useCheckUserInfo from "../../common/useCheckUserInfo";
import RefresherItem from "../../components/CommonUI/RefresherItem";
import { Events } from "../../models";
import EventCard from "./EventCard";
import { EventSkeleton } from "./EventCard/EventCard";
import { getEvent } from "./services";

const EventPage: React.FC = () => {
  const { t } = useTranslation();
  const { userId } = useAuth();
  const { isVerify } = useCheckUserInfo(userId);
  const history = useHistory();

  const [eventsList, setEventsList] = useState<Events[]>([]);

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading((p) => !p);
    const events = await getEvent();
    if (events.length > 0) {
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
          <IonTitle>{t("Events")}</IonTitle>
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
              .map((item, index) => (
                <EventCard isVerify={isVerify} event={item} key={index} />
              ))
          ) : (
            <IonContent className="ion-padding">
              <IonSlide>
                <div className="ion-margin">
                  <IonImg
                    src="/assets/image/slides2.svg"
                    style={{
                      height: window.screen.height / 4,
                      marginBottom: 10,
                    }}
                  />
                  <IonLabel
                    style={{
                      fontSize: "x-large",
                      margin: "auto",
                      lineHeight: "40px",
                    }}
                  >
                    <b>{t("Upcoming events will appear here")}</b>
                  </IonLabel>
                </div>
              </IonSlide>
            </IonContent>
          )
        ) : (
          <>
            <EventSkeleton />
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default EventPage;
