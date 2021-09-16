import {
  IonButton,
  IonCard,
  IonCardContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonSkeletonText,
  IonText,
  IonThumbnail,
  useIonAlert,
} from "@ionic/react";
import { location, ticket, time, trashBin } from "ionicons/icons";
import moment from "moment";
import "moment/locale/vi";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../../../../auth";
import { firestore } from "../../../../firebase";
import { Events } from "../../../../models";
import { getInfoByUserId } from "../../../HomePage/services";
import "./TicketCard.scss";

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
  status: String;
  isPast?: boolean;
}

function calImgScale() {
  const width = window.screen.width - 32;
  const height = (width * 9) / 16;
  return { width: width, height: height };
}

const TicketCard: React.FC<Props> = (props) => {
  const history = useHistory();
  const { userId } = useAuth();

  const { event, status, isPast } = props;

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
          <IonItem lines="full">
            {event.pictureUrl && (
              <IonThumbnail slot="start">
                {imgLoaded ? null : (
                  <IonSkeletonText animated style={{ borderRadius: 10 }} />
                )}
                <img
                  src={event.pictureUrl}
                  alt=""
                  style={
                    !imgLoaded
                      ? { display: "none" }
                      : {
                          objectFit: "cover",
                          borderRadius: 10,
                        }
                  }
                  onLoad={() => setImgLoaded(true)}
                />
              </IonThumbnail>
            )}

            <div
              style={{ width: "100%", marginTop: 10, marginBottom: 10 }}
              onClick={() => {}}
            >
              <IonText color="dark" text-wrap>
                <b style={{ fontSize: "large" }}>{event.title}</b>
              </IonText>
              <IonLabel color="medium" text-wrap>
                <p>
                  <IonIcon icon={location} slot="start" />
                  {"  "}
                  {event.location}
                </p>
              </IonLabel>
              <IonLabel color="medium" text-wrap>
                <p style={{ textTransform: "capitalize" }}>
                  <IonIcon icon={time} slot="start" />
                  {"  "}
                  {moment(event.startDate)
                    .locale("vi")
                    .format("dddd, Do MMMM, H:mm")}
                  {moment(event.startDate).isSame(moment(event.endDate), "day")
                    ? moment(event.endDate).locale("vi").format(" - H:mm")
                    : moment(event.endDate)
                        .locale("vi")
                        .format(" - dddd, Do MMMM, H:mm")}
                </p>
              </IonLabel>
              <IonLabel color="medium" text-wrap>
                <p>
                  <IonIcon icon={ticket} slot="start" />
                  {"  "}
                  Trạng thái:{" "}
                  <IonText
                    color={
                      status === "register"
                        ? "primary"
                        : status === "checkin"
                        ? "success"
                        : status === "wishlist"
                        ? "warning"
                        : "medium"
                    }
                  >
                    <b>
                      {status === "register"
                        ? "Đã đăng ký"
                        : status === "checkin"
                        ? "Đã check in"
                        : status === "wishlist"
                        ? "Danh sách chờ"
                        : ""}
                    </b>
                  </IonText>
                </p>
              </IonLabel>
              <IonButton
                shape="round"
                expand="block"
                color="danger"
                fill="outline"
                style={{ marginTop: 10 }}
                disabled={status === "checkin"}
                hidden={isPast}
              >
                <IonIcon icon={trashBin} slot="start" size="small" />
                Huỷ đăng ký
              </IonButton>
            </div>
          </IonItem>
        )
      ) : (
        <Skeleton />
      )}
    </>
  );
};

export default TicketCard;
