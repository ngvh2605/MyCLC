import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { firestore } from "../../../firebase";
import { getInfoByUserId } from "../../HomePage/services";

interface RouteParams {
  id: string;
}

const EventRegisterList: React.FC = () => {
  const { id } = useParams<RouteParams>();

  const [tickets, setTickets] = useState<
    {
      userId: string;
      status: string;
    }[]
  >();
  const [userInfo, setUserInfo] = useState<any[]>();

  useEffect(() => {
    console.log(id);
    fetchTickets();
  }, [id]);

  useEffect(() => {
    console.log(tickets);
    const getUser = async (userId: string) => {
      if (userInfo)
        setUserInfo([...userInfo, ...(await getInfoByUserId(userId))]);
      else setUserInfo([await getInfoByUserId(userId)]);
    };

    if (tickets && tickets.length > 0) {
      tickets.forEach((ticket) => {
        getUser(ticket.userId);
      });
    }
  }, [tickets]);

  useEffect(() => {
    console.log(userInfo);
  }, [userInfo]);

  const fetchTickets = () => {
    firestore
      .collection("eventsTicket")
      .where("eventId", "==", id)
      .onSnapshot(({ docs }) => {
        let temp: any[] = [];
        docs.map((doc) => {
          temp.push({ userId: doc.data().userId, status: doc.data().status });
        });
        setTickets(temp);
      });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton text="" defaultHref="/my/manage" />
          </IonButtons>
          <IonTitle>Danh sách</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonLabel>Something</IonLabel>
        <IonList>
          {userInfo &&
            userInfo.map((user) => (
              <IonItem>
                <IonLabel>{user.fullName}</IonLabel>
              </IonItem>
            ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default EventRegisterList;
