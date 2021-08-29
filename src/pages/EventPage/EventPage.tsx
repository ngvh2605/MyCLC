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
  IonSlide,
} from "@ionic/react";
import { mailUnreadOutline } from "ionicons/icons";
import React, { useState, useEffect } from "react";
import { auth as firebaseAuth } from "../../firebase";

const EventPage: React.FC = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertHeader, setAlertHeader] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Sự kiện</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonChip
          color="primary"
          style={{ height: "max-content", marginBottom: 10 }}
          className="ion-margin"
        >
          <IonLabel text-wrap className="ion-padding">
            Cảm ơn bạn đã hoàn thành 3 bước xác minh. Hãy cùng đón chờ những
            chức năng mới sẽ được ra mắt trong thời gian sớm nhất nhé. Nếu bạn
            có đóng góp hay báo lỗi thì hãy liên hệ với CLC Multimedia nha!
          </IonLabel>
        </IonChip>
        <IonSlide style={{ height: "50%" }}>
          <div className="ion-margin">
            <IonImg
              src="/assets/image/construction.svg"
              style={{ height: window.screen.height / 4, marginBottom: 10 }}
            />
            <IonLabel
              style={{
                fontSize: "x-large",
                margin: "auto",
                lineHeight: "40px",
              }}
            >
              <b>Đang xây dựng</b>
            </IonLabel>
          </div>
        </IonSlide>
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
