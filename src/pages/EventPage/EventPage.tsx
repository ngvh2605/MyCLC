import {
  IonContent,
  IonHeader,
  IonIcon,
  IonLabel,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonButton,
  IonAlert,
  IonChip,
  IonRefresher,
  IonRefresherContent,
  IonFab,
  IonFabButton,
  IonCard,
  IonItem,
  IonAvatar,
  IonSkeletonText,
  IonNote,
  IonCardSubtitle,
  IonCardContent,
} from "@ionic/react";
import {
  arrowUp,
  chevronDown,
  add as addIcon,
  ticketOutline,
} from "ionicons/icons";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../auth";
import { auth as firebaseAuth, firestore } from "../../firebase";
import EventCard from "./EventCard";
import { getEvent, getNextEvent } from "./services";
import { RefresherEventDetail } from "@ionic/core";
import { Events } from "../../models";
import { useHistory } from "react-router-dom";

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

const EventPage: React.FC = () => {
  const { userId } = useAuth();
  const history = useHistory();

  const [showAlert, setShowAlert] = useState(false);
  const [alertHeader, setAlertHeader] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const [totalEvents, setTotalEvents] = useState(0);

  const [eventsList, setEventsList] = useState<Events[]>([]);
  const [lastKey, setLastKey] = useState<number | string>(0);

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchEvents();
  }, []); //user id ko thay đổi trong suốt phiên làm việc nên ko cần cho vào đây

  const fetchMore = async () => {
    const events = await getNextEvent(lastKey, 1);
    setLastKey(events?.slice(-1)?.pop()?.createDate || lastKey);
    setEventsList([...eventsList, ...events]);
  };

  const fetchEvents = async () => {
    setLoading((p) => !p);
    const events = await getEvent(2);
    setLastKey(events.slice(-1).pop().createDate || 0);
    setEventsList(events);
    console.log(events);
    setLoading((p) => !p);
  };

  const refreshEvents = (event: CustomEvent<RefresherEventDetail>) => {
    fetchEvents();
    setTimeout(() => {
      event.detail.complete();
    }, 2000);
  };
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Sự kiện</IonTitle>
          <IonButtons
            slot="end"
            onClick={() => history.push("/my/event/ticket")}
          >
            <IonButton>
              <IonIcon icon={ticketOutline} color="primary" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonRefresher slot="fixed" onIonRefresh={refreshEvents}>
          <IonRefresherContent
            style={{ marginTop: 10 }}
            pullingIcon={chevronDown}
            pullingText="Kéo xuống để làm mới"
          ></IonRefresherContent>
        </IonRefresher>

        <IonFab
          hidden={
            eventsList.length > 0 ? eventsList.length >= totalEvents : true
          }
          vertical="top"
          horizontal="center"
          slot="fixed"
          className="fab-center"
        >
          <IonButton
            shape="round"
            onClick={() => {
              //setEventsList([]);
              fetchEvents();
            }}
          >
            <IonIcon icon={arrowUp} slot="start" />
            <IonLabel>Có tin mới</IonLabel>
          </IonButton>
        </IonFab>

        <IonChip
          color="primary"
          style={{ height: "max-content", marginBottom: 10 }}
          className="ion-margin"
          hidden={
            !(
              firebaseAuth.currentUser.metadata.creationTime ===
              firebaseAuth.currentUser.metadata.lastSignInTime
            )
          }
        >
          <IonLabel text-wrap className="ion-padding">
            Chúc mừng bạn đã đăng ký tài khoản thành công! Hãy vào Hồ sơ và thực
            hiện đủ 3 bước xác minh để có thể sử dụng các chức năng khác của
            MyCLC nhé!
          </IonLabel>
        </IonChip>

        {!loading ? (
          eventsList.map((item, index) => (
            <EventCard event={item} key={index} />
          ))
        ) : (
          <>
            <Skeleton />
          </>
        )}

        {/* <SampleEvents /> */}
        <IonButton
          style={{ display: "block", marginLeft: "auto", marginRight: "auto" }}
          fill="clear"
          hidden={false}
          onClick={() => fetchMore()}
        >
          <IonLabel>
            Đọc thêm
            <br />
            <IonIcon icon={chevronDown} />
          </IonLabel>
        </IonButton>

        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          cssClass="my-custom-class"
          header={alertHeader}
          message={alertMessage}
          buttons={["OK"]}
        />
      </IonContent>

      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        cssClass="my-custom-class"
        header={alertHeader}
        message={alertMessage}
        buttons={["OK"]}
      />
    </IonPage>
  );
};

export default EventPage;
