/* eslint-disable react-hooks/exhaustive-deps */
import {
  informationCircle,
  linkOutline,
  location,
  ticket,
  time,
} from "ionicons/icons";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation, useParams } from "react-router";

import {
  IonAvatar,
  IonBackButton,
  IonButton,
  IonButtons,
  IonCardContent,
  IonCardSubtitle,
  IonCardTitle,
  IonChip,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonSkeletonText,
  IonThumbnail,
  IonTitle,
  IonToolbar,
  useIonAlert,
} from "@ionic/react";

import { Storage } from "@capacitor/storage";
import Autolinker from "autolinker";
import { useAuth } from "../../../auth";
import { firestore } from "../../../firebase";
import { Events } from "../../../models";
import { buyTicket, getInfoByUserId } from "../../HomePage/services";
import { useTranslation } from "react-i18next";

interface stateType {
  isVerify: boolean;
  event: Events;
  authorInfo: any;
  isBuy: boolean;
}

const ViewEventPage: React.FC = () => {
  const { t } = useTranslation();
  const { userId } = useAuth();
  const history = useHistory();
  const locationRef = useLocation<stateType>();
  const { id } = useParams<{
    id: string;
  }>();

  const [isVerify, setIsVerify] = useState<boolean>(false);
  const [event, setEvent] = useState<Events>();
  const [authorInfo, setAuthorInfo] = useState<any>({});
  const [isBuy, setIsBuy] = useState<boolean>(false);

  const [imgLoaded, setImgLoaded] = useState<boolean>(false);

  const [presentAlert] = useIonAlert();

  useEffect(() => {
    console.log("id", id);
  }, [id]);

  useEffect(() => {
    if (locationRef.state) {
      console.log("ref", locationRef.state);
      try {
        setIsVerify(locationRef.state["isVerify"]);
        setEvent({ ...locationRef.state["event"] });
        setAuthorInfo({ ...locationRef.state["authorInfo"] });
        setIsBuy(locationRef.state["isBuy"]);
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        fetchEvent();
      } catch (err) {
        console.log(err);
      }
    }

    //is user buy ticket?
    const checkIsBuy = firestore
      .collection("eventsTicket")
      .where("eventId", "==", id)
      .where("userId", "==", userId)
      .onSnapshot((doc) => {
        if (doc.empty) setIsBuy(false);
        else setIsBuy(true);
      });

    return () => {
      if (!locationRef.state) {
        checkIsBuy();
      }
    };
  }, []);

  const fetchEvent = async () => {
    const data = await Storage.get({ key: "isVerify" });
    setIsVerify(data.value === "true" ? true : false);
    const tempEvent = (
      await firestore.collection("events").doc(id).get()
    ).data() as Events;
    setEvent({ ...tempEvent, id: id });
    setAuthorInfo(await getInfoByUserId(tempEvent.author));
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton text="" defaultHref="/my/event" />
          </IonButtons>
          <IonButtons slot="end"></IonButtons>
          <IonTitle>{t("Event")}</IonTitle>
        </IonToolbar>
      </IonHeader>

      {event ? (
        <IonContent>
          {event.pictureUrl && (
            <IonThumbnail
              style={{
                width: window.screen.width,
                height: (window.screen.width * 9) / 16,
              }}
            >
              {!imgLoaded && (
                <IonSkeletonText
                  animated
                  style={{
                    width: window.screen.width,
                    height: (window.screen.width * 9) / 16,
                  }}
                />
              )}
              <IonImg
                src={event.pictureUrl}
                style={!imgLoaded ? { opacity: 0 } : { opacity: 1 }}
                onIonImgDidLoad={() => setImgLoaded(true)}
              />
            </IonThumbnail>
          )}
          <IonItem
            lines="none"
            style={{ marginTop: 10, marginBottom: 10 }}
            onClick={() => {
              history.push(`/my/user/${event.author}`);
            }}
          >
            <IonAvatar slot="start">
              <IonImg
                src={
                  authorInfo && authorInfo.avatar
                    ? authorInfo.avatar
                    : "/assets/image/placeholder.png"
                }
              />
            </IonAvatar>
            <IonLabel color="dark" text-wrap>
              <b>
                {authorInfo && authorInfo.fullName ? authorInfo.fullName : ""}
              </b>
            </IonLabel>
          </IonItem>
          <IonCardContent style={{ paddingTop: 0, paddingBottom: 0 }}>
            <IonCardTitle color="dark" text-wrap>
              {event.title}
            </IonCardTitle>
          </IonCardContent>
          <IonList lines="none">
            <IonItem>
              <IonIcon icon={time} color="medium" slot="start" />
              <IonLabel text-wrap style={{ textTransform: "capitalize" }}>
                {moment(event.startDate)
                  .locale(localStorage.getItem("i18nLanguage") || "vi")
                  .format("dddd, Do MMMM, H:mm")}
                {moment(event.startDate).isSame(moment(event.endDate), "day")
                  ? moment(event.endDate)
                      .locale(localStorage.getItem("i18nLanguage") || "vi")
                      .format(" - H:mm")
                  : moment(event.endDate)
                      .locale(localStorage.getItem("i18nLanguage") || "vi")
                      .format(" - dddd, Do MMMM, H:mm")}
              </IonLabel>
            </IonItem>
            <IonItem>
              <IonIcon icon={location} color="medium" slot="start" />
              <IonLabel text-wrap>{event.location}</IonLabel>
            </IonItem>
            {event.description && (
              <IonItem>
                <IonIcon icon={informationCircle} color="medium" slot="start" />
                <IonLabel text-wrap>{event.description}</IonLabel>
              </IonItem>
            )}
            <IonItem>
              <IonIcon icon={ticket} color="medium" slot="start" />
              <IonLabel text-wrap>
                {event.sellTicket
                  ? event.sellInApp
                    ? t("Register via MyCLC")
                    : t("Register via external link")
                  : t("No registration required")}
              </IonLabel>
            </IonItem>
          </IonList>
          <IonCardContent>
            <IonCardSubtitle color="primary">
              {t("Event details")}
            </IonCardSubtitle>
            <IonLabel color="dark" text-wrap style={{ whiteSpace: "pre-wrap" }}>
              <div
                dangerouslySetInnerHTML={{
                  __html: Autolinker.link(decodeURI(event.body), {
                    truncate: { length: 50, location: "smart" },
                  }),
                }}
              ></div>
            </IonLabel>

            <div style={{ marginTop: 20, marginBottom: 16 }}>
              {event && event.sellTicket && event.sellInApp && (
                <>
                  {!event.totalBuy ||
                  (event.totalBuy && event.totalBuy < event.totalTicket) ? (
                    <IonButton
                      color="primary"
                      expand="block"
                      shape="round"
                      onClick={() => {
                        if (isVerify) {
                          presentAlert({
                            header: event.title,
                            message: t(
                              "Are you sure you want to register for this event?"
                            ),
                            buttons: [
                              t("Cancel"),
                              {
                                text: "OK",
                                handler: (d) => {
                                  buyTicket(userId, event.id);
                                  setIsBuy(true);
                                },
                              },
                            ],
                          });
                        } else {
                          presentAlert({
                            header: t("Warning"),
                            message: t(
                              "You need to complete 3 verification steps to be able to register!"
                            ),
                            buttons: [{ text: "OK" }],
                          });
                          history.push("/my/profile");
                        }
                      }}
                      hidden={isBuy}
                    >
                      <IonIcon icon={ticket} slot="start" />
                      <IonLabel>{t("Register")}</IonLabel>
                    </IonButton>
                  ) : (
                    <IonChip
                      color="primary"
                      style={{
                        height: "max-content",
                        marginTop: 10,
                      }}
                      hidden={!isBuy}
                    >
                      <IonLabel text-wrap className="ion-padding">
                        {t("Event maximum registration message")}
                      </IonLabel>
                    </IonChip>
                  )}
                  <IonChip
                    color="primary"
                    style={{
                      height: "max-content",
                      marginTop: 10,
                      marginBottom: 16,
                    }}
                    hidden={!isBuy}
                  >
                    <IonLabel text-wrap className="ion-padding">
                      {t("Cancel event message")}
                    </IonLabel>
                  </IonChip>
                  <IonButton
                    color="primary"
                    fill="solid"
                    expand="block"
                    shape="round"
                    onClick={() => {
                      //cancelTicket(userId, event.id);
                    }}
                    hidden={!isBuy}
                    disabled
                  >
                    <IonIcon icon={ticket} slot="start" />
                    <IonLabel>{t("Registered")}</IonLabel>
                  </IonButton>
                </>
              )}
              {event &&
                event.sellTicket &&
                !event.sellInApp &&
                event.externalLink && (
                  <IonButton
                    color="primary"
                    fill="outline"
                    expand="block"
                    shape="round"
                    href={event.externalLink}
                    target="_blank"
                  >
                    <IonIcon icon={linkOutline} slot="start" />
                    <IonLabel>{t("Visit link")}</IonLabel>
                  </IonButton>
                )}
            </div>
          </IonCardContent>
        </IonContent>
      ) : (
        <IonContent></IonContent>
      )}
    </IonPage>
  );
};

export default ViewEventPage;
