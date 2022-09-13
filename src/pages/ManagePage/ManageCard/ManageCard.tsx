import "moment/locale/vi";
import "./ManageCard.scss";

import {
  brush,
  close,
  ellipsisHorizontal,
  list,
  location,
  trash,
} from "ionicons/icons";
import moment from "moment";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import {
  IonActionSheet,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardSubtitle,
  IonIcon,
  IonImg,
  IonLabel,
  IonSkeletonText,
  IonThumbnail,
  useIonAlert,
} from "@ionic/react";
import { Events } from "../../../models";
import {
  calImgScale,
  EventSkeleton,
} from "../../EventPage/EventCard/EventCard";
import { useTranslation } from "react-i18next";
import { firestore, storage } from "../../../firebase";

interface Props {
  event: Events;
  allowEdit?: boolean;
  handleDelete?: any;
}

const ManageCard: React.FC<Props> = (props) => {
  const { t } = useTranslation();
  const history = useHistory();

  const { event, allowEdit, handleDelete } = props;

  const [showActionSheet, setShowActionSheet] = useState(false);
  const [presentAlert] = useIonAlert();

  const [imgLoaded, setImgLoaded] = useState<boolean>(false);

  const deleteEvent = async (event: Events) => {
    const task: Promise<void>[] = [];
    //delete picture from storage
    if (event.pictureUrl)
      task.push(storage.refFromURL(event.pictureUrl).delete());
    //delete participants
    const { docs: participants } = await firestore
      .collection("eventsTicket")
      .where("eventId", "==", event.id)
      .get();

    task.push(
      ...participants
        .filter((doc) => doc.exists)
        .map((doc) => firestore.collection("eventsTicket").doc(doc.id).delete())
    );

    //delete event
    task.push(firestore.collection("events").doc(event.id).delete());

    return Promise.all(task);
  };

  return (
    <>
      {true ? (
        event.body && (
          <div style={{ maxWidth: 680, margin: "0 auto" }}>
            <IonCard>
              {event.pictureUrl && (
                <IonThumbnail
                  style={{
                    height: calImgScale().height,
                    width: calImgScale().width,
                  }}
                >
                  {imgLoaded ? null : (
                    <IonSkeletonText
                      animated
                      style={{
                        height: calImgScale().height,
                        width: calImgScale().width,
                        margin: 0,
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

              <IonCardContent style={{ paddingBottom: 0 }} onClick={() => {}}>
                <IonCardSubtitle color="primary">
                  <IonLabel>
                    <IonIcon
                      icon={ellipsisHorizontal}
                      className="ion-float-right"
                      color="medium"
                      onClick={() => {
                        setShowActionSheet(true);
                      }}
                      style={{ fontSize: "large" }}
                      hidden={!allowEdit}
                    />
                    {moment(event.startDate)
                      .locale(localStorage.getItem("i18nLanguage") || "vi")
                      .format("dddd, Do MMMM, H:mm")}
                    {moment(event.startDate).isSame(
                      moment(event.endDate),
                      "day"
                    )
                      ? moment(event.endDate)
                          .locale(localStorage.getItem("i18nLanguage") || "vi")
                          .format(" - H:mm")
                      : moment(event.endDate)
                          .locale(localStorage.getItem("i18nLanguage") || "vi")
                          .format(" - dddd, Do MMMM, H:mm")}
                  </IonLabel>
                </IonCardSubtitle>
                <IonLabel color="dark" text-wrap>
                  <b style={{ fontSize: "large" }}>{event.title}</b>
                </IonLabel>
                <IonLabel color="medium" text-wrap>
                  <p>
                    <IonIcon icon={location} slot="start" />
                    {"  "}
                    {event.location}
                  </p>
                </IonLabel>
                <IonLabel text-wrap color="dark">
                  {event.description}
                </IonLabel>
                <div style={{ marginTop: 16, marginBottom: 16 }}>
                  <IonButton
                    color="primary"
                    expand="block"
                    shape="round"
                    fill="solid"
                    hidden={!(event.sellTicket && event.sellInApp)}
                    onClick={() => {
                      history.push({
                        pathname: `/my/manage/list/${event.id}`,
                        state: event,
                      });
                    }}
                  >
                    <IonIcon icon={list} slot="start" />
                    <IonLabel>{t("Registration list")}</IonLabel>
                  </IonButton>
                </div>
              </IonCardContent>

              <IonActionSheet
                isOpen={showActionSheet}
                onDidDismiss={() => setShowActionSheet(false)}
                cssClass="my-custom-class"
                buttons={[
                  {
                    text: t("Edit"),
                    icon: brush,
                    handler: () => {
                      history.push({
                        pathname: `/my/manage/add/${event.id}`,
                        state: event,
                      });
                    },
                  },
                  {
                    text: t("Delete"),
                    role: "destructive",
                    icon: trash,
                    handler: () => {
                      presentAlert({
                        header: t("Are you sure?"),
                        message: t("This will be permanently deleted"),
                        buttons: [
                          t("Cancel"),
                          {
                            text: t("Delete"),
                            handler: (d) => {
                              deleteEvent(event);
                              handleDelete(event.id);
                            },
                          },
                        ],
                      });
                    },
                  },
                  {
                    text: t("Cancel"),
                    icon: close,
                    role: "cancel",
                    handler: () => {
                      console.log("Cancel clicked");
                    },
                  },
                ]}
              ></IonActionSheet>
            </IonCard>
          </div>
        )
      ) : (
        <EventSkeleton />
      )}
    </>
  );
};

export default ManageCard;
