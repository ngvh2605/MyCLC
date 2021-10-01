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
import { useLocation } from "react-router";

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

import { useAuth } from "../../../auth";
import { Events } from "../../../models";
import { buyTicket } from "../../HomePage/services";

interface stateType {
  event: Events;
  authorInfo: any;
  isBuy: boolean;
}

const ViewEventPage: React.FC = () => {
  const { userId } = useAuth();
  const locationRef = useLocation<stateType>();

  const [event, setEvent] = useState<Events>();
  const [authorInfo, setAuthorInfo] = useState<any>({});
  const [isBuy, setIsBuy] = useState<boolean>(false);
  const [imgLoaded, setImgLoaded] = useState<boolean>(false);

  const [presentAlert] = useIonAlert();

  useEffect(() => {
    if (locationRef.state) {
      try {
        setEvent({ ...locationRef.state["event"] });
        setAuthorInfo({ ...locationRef.state["authorInfo"] });
        setIsBuy(locationRef.state["isBuy"]);
      } catch (err) {
        console.log(err);
      }
    }
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton text="" defaultHref="/my/event" />
          </IonButtons>
          <IonButtons slot="end"></IonButtons>
          <IonTitle>Sự kiện</IonTitle>
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
                  {authorInfo && authorInfo.fullName ? authorInfo.fullName : ""}
                </b>
              </p>
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
                  .locale("vi")
                  .format("dddd, Do MMMM, H:mm")}
                {moment(event.startDate).isSame(moment(event.endDate), "day")
                  ? moment(event.endDate).locale("vi").format(" - H:mm")
                  : moment(event.endDate)
                      .locale("vi")
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
                    ? "Đăng ký qua ứng dụng MyCLC"
                    : "Đăng ký qua liên kết bên ngoài"
                  : "Sự kiện không cần đăng ký"}
              </IonLabel>
            </IonItem>
          </IonList>
          <IonCardContent>
            <IonCardSubtitle color="primary">Chi tiết sự kiện</IonCardSubtitle>
            <IonLabel color="dark" text-wrap style={{ whiteSpace: "pre-wrap" }}>
              {decodeURI(event.body)}
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
                                setIsBuy(true);
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
                        Số lượng đăng ký cho phép đã đạt tối đa. Vui lòng liên
                        hệ trực tiếp với ban tổ chức để được hỗ trợ nếu cần
                        thiết
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
                      Để huỷ đăng ký, bạn cần vào mục <b>Sự kiện của bạn</b>{" "}
                      (biểu tượng <IonIcon icon={ticket} />) ở góc phải trên của
                      trang <b>Sự kiện</b>
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
        </IonContent>
      ) : (
        <IonContent></IonContent>
      )}
    </IonPage>
  );
};

export default ViewEventPage;
