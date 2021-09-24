import {
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonPage,
  IonTitle,
  IonToolbar,
  IonImg,
  IonButtons,
  IonMenuButton,
  IonButton,
  IonCard,
  IonAlert,
  IonCardSubtitle,
  IonCardContent,
  IonAvatar,
  IonChip,
  IonGrid,
  IonRow,
  IonCol,
  IonBadge,
} from "@ionic/react";
import {
  globe,
  logoFacebook,
  logoInstagram,
  logoLinkedin,
  logoYoutube,
  mail,
  mailUnreadOutline,
} from "ionicons/icons";
import React, { useState, useEffect } from "react";
import { auth as firebaseAuth, database } from "../../firebase";

const TimetablePage: React.FC = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertHeader, setAlertHeader] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    fetchData();
  });

  const fetchData = async () => {
    const timetableRef = database.ref().child("timetable");
    timetableRef.once("value").then(function (snapshot) {
      snapshot.forEach(function (child) {
        console.log(child.val());
        console.log(child.key);
      });
    });
    //console.log(timetableRef);
  };

  const writeTimetable = () => {
    const timetableRef = database.ref().child("timetable");
    const newPostRef = timetableRef.push();
    newPostRef
      .set({
        week2: "none",
      })
      .then(() => {
        console.log("done");
      });
  };
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Thời khoá biểu</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonButton onClick={() => writeTimetable()}>Click</IonButton>
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

export default TimetablePage;
