import "moment/locale/vi";
import "./TicketCard.scss";

import { location, ticket, time, trashBin } from "ionicons/icons";
import moment from "moment";
import React, { useState } from "react";

import {
  IonButton,
  IonCard,
  IonCardContent,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonSkeletonText,
  IonText,
  IonThumbnail,
  useIonAlert,
} from "@ionic/react";

import { useAuth } from "../../../../auth";
import { Events } from "../../../../models";
import { cancelTicket } from "../../../HomePage/services";

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
const TicketCard: React.FC<Props> = (props) => {
  const { userId } = useAuth();

  const { event, status, isPast } = props;

  const [presentAlert] = useIonAlert();
  const [imgLoaded, setImgLoaded] = useState<boolean>(false);

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
                <IonImg
                  src={event.pictureUrl}
                  style={
                    !imgLoaded
                      ? { opacity: 0, borderRadius: 10 }
                      : {
                          opacity: 1,
                          borderRadius: 10,
                        }
                  }
                  onIonImgDidLoad={(event) => {
                    setImgLoaded(true);
                  }}
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
                onClick={() => {
                  presentAlert({
                    header: event.title,
                    message:
                      "Bạn có chắc chắn huỷ đăng ký tham gia sự kiện này không?",
                    buttons: [
                      "Huỷ",
                      {
                        text: "Đồng ý",
                        handler: (d) => {
                          cancelTicket(userId, event.id);
                        },
                      },
                    ],
                    onDidDismiss: (e) => console.log("did dismiss"),
                  });
                }}
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
