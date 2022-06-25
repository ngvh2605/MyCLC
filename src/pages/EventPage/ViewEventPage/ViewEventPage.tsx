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

import { useAuth } from "../../../auth";
import { Events } from "../../../models";
import { buyTicket, getInfoByUserId } from "../../HomePage/services";
import Autolinker from "autolinker";
import { database, firestore } from "../../../firebase";
import { Storage } from "@capacitor/storage";

interface stateType {
  isVerify: boolean;
  event: Events;
  authorInfo: any;
  isBuy: boolean;
}

const ViewEventPage: React.FC = () => {
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
                          });
                        } else {
                          presentAlert({
                            header: "Lưu ý",
                            message:
                              "Bạn cần hoàn thành 3 bước xác minh để có thể đăng ký tham gia!",
                            buttons: [{ text: "OK" }],
                          });
                          history.push("/my/profile");
                        }
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
