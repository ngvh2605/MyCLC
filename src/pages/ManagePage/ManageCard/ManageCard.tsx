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
  allowEdit?: boolean;
}

function calImgScale() {
  const width = window.screen.width - 64;
  const height = (width * 9) / 16;
  return { width: width, height: height };
}

const ManageCard: React.FC<Props> = (props) => {
  const history = useHistory();

  const { event, allowEdit } = props;

  const [showActionSheet, setShowActionSheet] = useState(false);
  const [presentAlert] = useIonAlert();

  const [imgLoaded, setImgLoaded] = useState<boolean>(false);

  return (
    <>
      {true ? (
        event.body && (
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
                    .locale("vi")
                    .format("dddd, Do MMMM, H:mm")}
                  {moment(event.startDate).isSame(moment(event.endDate), "day")
                    ? moment(event.endDate).locale("vi").format(" - H:mm")
                    : moment(event.endDate)
                        .locale("vi")
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
                  <IonLabel>Danh sách đăng ký</IonLabel>
                </IonButton>
              </div>
            </IonCardContent>

            <IonActionSheet
              isOpen={showActionSheet}
              onDidDismiss={() => setShowActionSheet(false)}
              cssClass="my-custom-class"
              buttons={[
                {
                  text: "Chỉnh sửa",
                  icon: brush,
                  handler: () => {
                    history.push({
                      pathname: `/my/manage/add/${event.id}`,
                      state: event,
                    });
                  },
                },
                {
                  text: "Xoá",
                  role: "destructive",
                  icon: trash,
                  handler: () => {
                    presentAlert({
                      header: "Xoá bài viết",
                      message:
                        "Bạn có chắc chắn xoá vĩnh viễn sự kiện này khỏi MyCLC không?",
                      buttons: [
                        "Huỷ",
                        {
                          text: "Xoá",
                          handler: (d) => {
                            //setNews({ ...news, body: "" });
                            //deleteNews(news);
                          },
                        },
                      ],
                      onDidDismiss: (e) => console.log("did dismiss"),
                    });
                  },
                },
                {
                  text: "Cancel",
                  icon: close,
                  role: "cancel",
                  handler: () => {
                    console.log("Cancel clicked");
                  },
                },
              ]}
            ></IonActionSheet>
          </IonCard>
        )
      ) : (
        <Skeleton />
      )}
    </>
  );
};

export default ManageCard;
