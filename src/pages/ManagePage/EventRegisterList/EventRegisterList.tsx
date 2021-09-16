import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
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
        <IonList>
          {tickets &&
            tickets.length > 0 &&
            userInfo &&
            userInfo.length > 0 &&
            userInfo.map((user, index) => (
              <IonItem key={index} lines="full" detail={true}>
                <IonIcon
                  icon={checkmarkCircle}
                  color="success"
                  slot="start"
                  style={{
                    opacity: tickets[index].status === "checkin" ? 1 : 0,
                  }}
                />
                <IonLabel text-wrap>{user.fullName}</IonLabel>
                <IonButton
                  onClick={() => {
                    handleCheckin(index);
                  }}
                  hidden={tickets[index].status === "checkin"}
                >
                  Check in
                </IonButton>
              </IonItem>
            ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default EventRegisterList;
