import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonItemDivider,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  IonPage,
  IonSearchbar,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { alertCircle, checkmarkCircle } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router";
import { firestore } from "../../../firebase";
import { Events } from "../../../models";
import { getInfoByUserId } from "../../HomePage/services";

interface RouteParams {
  id: string;
}

const EventRegisterList: React.FC = () => {
  const { id } = useParams<RouteParams>();
  const locationRef = useLocation<Events>();

  const [events, setEvents] = useState<Events>();
  const [tickets, setTickets] = useState<
    {
      userId: string;
      status: string;
    }[]
  >();
  const [userInfo, setUserInfo] = useState<any[]>();
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (locationRef.state) {
      const temp: Events = { ...locationRef.state };
      setEvents(temp);
    }
  }, [locationRef]);

  useEffect(() => {
    const fetchTickets = firestore
      .collection("eventsTicket")
      .where("eventId", "==", id)
      .onSnapshot(({ docs }) => {
        let temp: any[] = [];
        docs.map((doc) => {
          temp.push({ userId: doc.data().userId, status: doc.data().status });
        });
        setTickets(temp);
      });

    return () => {
      fetchTickets();
    };
  }, [id]);

  useEffect(() => {
    console.log(tickets);
    const fetchUserInfo = async () => {
      let tempInfo = [];
      for (let item of tickets) {
        tempInfo.push(await getInfoByUserId(item.userId));
      }
      setUserInfo(tempInfo);
    };
    if (tickets && tickets.length > 0) {
      fetchUserInfo();
    }
  }, [tickets]);

  useEffect(() => {
    console.log(userInfo);
  }, [userInfo]);

  const handleCheckin = (index: number) => {
    firestore
      .collection("eventsTicket")
      .doc(`${id}_${tickets[index].userId}`)
      .update({ status: "checkin" });
  };

  const handleUnCheckin = (index: number) => {
    firestore
      .collection("eventsTicket")
      .doc(`${id}_${tickets[index].userId}`)
      .update({ status: "register" });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton text="" defaultHref="/my/manage" />
          </IonButtons>
          <IonTitle>{events && events.title}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonItemDivider color="primary">
          <IonLabel>
            Số lượng đăng ký: {tickets && tickets.length ? tickets.length : 0}
          </IonLabel>
        </IonItemDivider>
        <IonSearchbar
          placeholder="Tìm kiếm"
          onIonChange={(e) => {
            setSearch(e.detail.value);
          }}
        ></IonSearchbar>
        <IonList>
          {tickets &&
            tickets.length > 0 &&
            userInfo &&
            userInfo.length > 0 &&
            userInfo
              .filter(function (user) {
                return (
                  user.fullName.toLowerCase().includes(search.toLowerCase()) ||
                  user.email.toLowerCase().includes(search.toLowerCase())
                );
              })
              .map((user, index) => (
                <IonItemSliding key={index}>
                  <IonItem lines="full" detail={true}>
                    <IonIcon
                      icon={checkmarkCircle}
                      color="success"
                      slot="start"
                      style={{
                        opacity: tickets[index].status === "checkin" ? 1 : 0,
                      }}
                    />
                    <IonLabel text-wrap>
                      <IonText>
                        <b>{user.fullName}</b>
                      </IonText>
                      <br />
                      <IonText>{user.email}</IonText>
                    </IonLabel>
                    <IonButton
                      onClick={() => {
                        handleCheckin(index);
                      }}
                      hidden={true}
                    >
                      Check in
                    </IonButton>
                  </IonItem>

                  <IonItemOptions side="end">
                    <IonItemOption
                      color="success"
                      onClick={() => handleCheckin(index)}
                      hidden={tickets[index].status === "checkin"}
                    >
                      Check in
                    </IonItemOption>
                  </IonItemOptions>

                  <IonItemOptions side="start">
                    <IonItemOption
                      color="danger"
                      onClick={() => handleUnCheckin(index)}
                      hidden={!(tickets[index].status === "checkin")}
                    >
                      Huỷ check in
                    </IonItemOption>
                  </IonItemOptions>
                </IonItemSliding>
              ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default EventRegisterList;
