import {
  IonButton,
  IonButtons,
  IonCard,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonLoading,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonToast,
} from "@ionic/react";
import { searchOutline } from "ionicons/icons";
import React, { useState } from "react";
import { useAuth } from "../../../auth";
import useCheckUserInfo from "../../../common/useCheckUserInfo";
import { firestore } from "../../../firebase";

interface Match {
  mentor_mail: String;
  mentor_name: String;
  mentee_mail: String;
  mentee_name: String;
  mentee_phone: String | number;
  mentee_school: String;
  mentee_subject: String;
}

const In2CLCHomePage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { userId } = useAuth();
  const { isVerify } = useCheckUserInfo(userId);

  const [presentToast] = useIonToast();

  const searchMentee = async () => {
    setIsLoading(true);
    const data: Match[] = JSON.parse(
      (await firestore.collection("in2clc").doc("match").get()).data().match
    );
    const search = data.find((a) => {
      return a.mentor_mail === "tongkhanhlinh2041990@gmail.com";
    });
    console.log(search);
    setIsLoading(false);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>In2CLC</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonCard>
          <IonImg src="https://firebasestorage.googleapis.com/v0/b/myclcproject.appspot.com/o/public%2F%5BIn2CLC%202022%5D%20Avatar.jpeg?alt=media&token=8c539497-05e7-4a0d-a78b-b57df7fd1f2a" />
        </IonCard>

        <div className="ion-padding">
          <IonButton
            expand="block"
            shape="round"
            className="ion-margin-top"
            onClick={() => {
              searchMentee();
            }}
          >
            <IonIcon icon={searchOutline} slot="start" />
            Tìm thông tin Mentee
          </IonButton>
        </div>

        <IonLoading isOpen={isLoading} />
      </IonContent>
    </IonPage>
  );
};

export default In2CLCHomePage;
