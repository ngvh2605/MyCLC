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
import {
  brushOutline,
  linkOutline,
  list,
  location,
  ticket,
  trashBinOutline,
} from "ionicons/icons";
import moment from "moment";
import "moment/locale/vi";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../../../auth";
import { firestore } from "../../../firebase";
import { Events } from "../../../models";
import { cancelTicket, getInfoByUserId } from "../../HomePage/services";
import { buyTicket } from "../../HomePage/services";
import "./ManageCard.scss";

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

const ManageCard: React.FC<Props> = (props) => {
  const history = useHistory();
  const { userId } = useAuth();

  const { event } = props;

  const [showActionSheet, setShowActionSheet] = useState(false);
  const [presentAlert] = useIonAlert();

  const [imgLoaded, setImgLoaded] = useState<boolean>(false);

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

            <IonCardContent style={{ paddingBottom: 0 }} onClick={() => {}}>
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
              <IonText color="dark" text-wrap>
                <b style={{ fontSize: "large" }}>{event.title}</b>
              </IonText>
              <IonCardSubtitle
                style={{
                  textTransform: "none",
                  fontWeight: "normal",
                }}
              >
                <IonLabel color="medium" text-wrap>
                  <p>
                    <IonIcon icon={location} slot="start" />
                    {"  "}
                    {event.location}
                  </p>
                </IonLabel>
              </IonCardSubtitle>
              <IonLabel text-wrap color="dark">
                {event.description}
              </IonLabel>
              <IonGrid>
                <IonRow>
                  <IonCol size="6">
                    <IonButton
                      color="danger"
                      expand="block"
                      shape="round"
                      fill="outline"
                    >
                      <IonIcon icon={trashBinOutline} slot="start" />
                      <IonLabel>Xoá</IonLabel>
                    </IonButton>
                  </IonCol>
                  <IonCol size="6">
                    <IonButton
                      color="primary"
                      expand="block"
                      shape="round"
                      fill="outline"
                    >
                      <IonIcon icon={brushOutline} slot="start" />
                      <IonLabel>Sửa</IonLabel>
                    </IonButton>
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol>
                    <IonButton
                      color="primary"
                      expand="block"
                      shape="round"
                      fill="solid"
                    >
                      <IonIcon icon={list} slot="start" />
                      <IonLabel>Danh sách đăng ký</IonLabel>
                    </IonButton>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonCardContent>
          </IonCard>
        )
      ) : (
        <Skeleton />
      )}
    </>
  );
};

export default ManageCard;
