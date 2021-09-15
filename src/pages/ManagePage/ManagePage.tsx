import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { mailUnreadOutline } from "ionicons/icons";
import "moment/locale/vi";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { useAuth } from "../../auth";
import { firestore } from "../../firebase";
import { Events, toEvents } from "../../models";
import ManageCard from "./ManageCard";
import "./ManagePage.scss";

const ManagePage: React.FC = () => {
  const { userId } = useAuth();
  const history = useHistory();

  const [events, setEvents] = useState<Events[]>();

  useEffect(() => {
    fetchEvent();
  }, []);

  const fetchEvent = async () => {
    const { docs } = await firestore
      .collection("events")
      .where("author", "==", userId)
      //.orderBy("startDate", "asc")
      .get();

    console.log(docs.map(toEvents));
    setEvents(docs.map(toEvents));
  };

  return (
    <IonPage id="manage-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Quản lý</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => {}}>
              <IonIcon icon={mailUnreadOutline} color="primary" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonButton
          expand="block"
          shape="round"
          onClick={() => history.push("/my/manage/add")}
        >
          Tạo sự kiện
        </IonButton>

        {events &&
          events.map((item, index) => <ManageCard event={item} key={index} />)}
      </IonContent>
    </IonPage>
  );
};

export default ManagePage;
