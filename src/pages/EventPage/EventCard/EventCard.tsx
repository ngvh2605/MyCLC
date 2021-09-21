import {
  IonAvatar,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardSubtitle,
  IonCol,
  IonGrid,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonRow,
  IonSkeletonText,
  IonText,
  useIonAlert,
} from "@ionic/react";
import { linkOutline, location, ticket } from "ionicons/icons";
import moment from "moment";
import "moment/locale/vi";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../../../auth";
import { firestore } from "../../../firebase";
import { Events } from "../../../models";
import { cancelTicket, getInfoByUserId } from "../../HomePage/services";
import { buyTicket } from "./../../HomePage/services";
import "./EventCard.scss";

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

interface Props {
  event: Events;
}

function calImgScale() {
  const width = window.screen.width - 64;
  const height = (width * 9) / 16;
  return { width: width, height: height };
}

const EventCard: React.FC<Props> = (props) => {
  const history = useHistory();
  const { userId } = useAuth();

  const { event } = props;

  const [authorInfo, setAuthorInfo] = useState<any>({});
  const [isBuy, setIsBuy] = useState(false);

  const [showActionSheet, setShowActionSheet] = useState(false);
  const [presentAlert] = useIonAlert();

  const [imgLoaded, setImgLoaded] = useState<boolean>(false);

  useEffect(() => {
    const getAuthor = async () => {
      setAuthorInfo(await getInfoByUserId(event.author));
    };
    getAuthor();

    //is user buy ticket?
    const checkIsBuy = firestore
      .collection("eventsTicket")
      .where("eventId", "==", event.id)
      .where("userId", "==", userId)
      .onSnapshot((doc) => {
        if (doc.empty) setIsBuy(false);
        else setIsBuy(true);
      });

    return () => {
      checkIsBuy();
    };
  }, [event]);

  return (
    <>
      {true ? (
        event.body && (
          <IonCard>
            {event.pictureUrl && (
              <div>
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
                <img
                  src={event.pictureUrl}
                  alt=""
                  style={
                    !imgLoaded
                      ? { display: "none" }
                      : {
                          objectFit: "cover",
                          height: calImgScale().height,
                          width: calImgScale().width,
                        }
                  }
                  onLoad={() => setImgLoaded(true)}
                />
              </div>
            )}
            <IonItem lines="none" style={{ marginTop: 10, marginBottom: 10 }}>
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
                <p>
                  <b>
                    {authorInfo && authorInfo.fullName
                      ? authorInfo.fullName
                      : ""}
                  </b>
                </p>
              </IonLabel>
            </IonItem>
            <IonCardContent
              style={{ paddingTop: 0, paddingBottom: 0 }}
              onClick={() => {}}
            >
              <IonCardSubtitle color="primary">
                {moment(event.startDate)
                  .locale("vi")
                  .format("dddd, Do MMMM, H:mm")}
                {moment(event.startDate).isSame(moment(event.endDate), "day")
                  ? moment(event.endDate).locale("vi").format(" - H:mm")
                  : moment(event.endDate)
                      .locale("vi")
                      .format(" - dddd, Do MMMM, H:mm")}
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
                {event && event.sellTicket && event.sellInApp && (
                  <>
                    {(!event.totalBuy ||
                      (event.totalBuy &&
                        event.totalBuy < event.totalTicket)) && (
                      <IonButton
                        color="primary"
                        expand="block"
                        shape="round"
                        onClick={() => {
                          presentAlert({
                            header: event.title,
                            message:
                              "Bạn có chắc chắn đăng ký tham gia sự kiện này không?",
                            buttons: [
                              "Huỷ",
                              {
                                text: "Đồng ý",
                                handler: (d) => {
                                  buyTicket(userId, event.id);
                                },
                              },
                            ],
                            onDidDismiss: (e) => console.log("did dismiss"),
                          });
                        }}
                        hidden={isBuy}
                      >
                        <IonIcon icon={ticket} slot="start" />
                        <IonLabel>Đăng ký</IonLabel>
                      </IonButton>
                    )}
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
                      <IonLabel>Đã đăng ký</IonLabel>
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
                      <IonLabel>Truy cập liên kết</IonLabel>
                    </IonButton>
                  )}
              </div>
            </IonCardContent>
          </IonCard>
        )
      ) : (
        <Skeleton />
      )}
    </>
  );
};

export default EventCard;