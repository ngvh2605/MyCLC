import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonLabel,
  IonLoading,
  IonMenuButton,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
  useIonToast,
} from "@ionic/react";
import Autolinker from "autolinker";
import { heart, searchOutline } from "ionicons/icons";
import React, { useState } from "react";
import { useAuth } from "../../../auth";
import useCheckUserInfo from "../../../common/useCheckUserInfo";
import { database, firestore } from "../../../firebase";
import { Match } from "../model";
import useIn2CLCCheck from "../useIn2CLCCheck";

const In2CLCHomePage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { userId, userEmail } = useAuth();
  const { isVerify } = useCheckUserInfo(userId);
  const { matchInfo } = useIn2CLCCheck(userId);

  const [presentToast] = useIonToast();

  const searchMentee = async () => {
    setIsLoading(true);
    const data: Match[] = JSON.parse(
      (await firestore.collection("in2clc").doc("match").get()).data().match
    );
    const search = data.find((a) => {
      return (
        a.mentor_mail.toLowerCase().replace(/ /g, "") ===
        userEmail.toLowerCase().replace(/ /g, "")
      );
    });

    if (!!search) {
      database
        .ref()
        .child("in2clc")
        .child(userId)
        .update({ ...search });
    }
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

        {!!matchInfo ? (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle color="danger" style={{ textAlign: "center" }}>
                <IonIcon icon={heart} style={{ verticalAlign: "-4px" }} /> It's
                a Match!
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonCardSubtitle color="primary">MENTOR</IonCardSubtitle>
              <IonLabel color="dark">
                <b>{matchInfo.mentor_name}</b>
              </IonLabel>
              <br />
              <br />
              <IonCardSubtitle color="primary">MENTEE</IonCardSubtitle>

              <IonLabel color="dark">
                <b>{matchInfo.mentee_name}</b>
              </IonLabel>
              <br />
              <br />
              <IonCardSubtitle color="primary">THÔNG TIN</IonCardSubtitle>
              <IonLabel color="dark">
                <div>
                  <b>Email:</b> {matchInfo.mentee_mail}
                  <br />
                  <b>SĐT:</b> {matchInfo.mentee_phone}
                  <br />
                  <b>Facebook:</b>{" "}
                  <span
                    dangerouslySetInnerHTML={{
                      __html: Autolinker.link(matchInfo.mentee_fb.toString(), {
                        truncate: { length: 50, location: "smart" },
                      }),
                    }}
                  ></span>
                  <br />
                  <b>Lớp:</b> {matchInfo.mentee_class}
                  <br />
                  <b>Trường:</b> {matchInfo.mentee_school}
                  <br />
                  <b>Môn chuyên NV1:</b> {matchInfo.mentee_subject}
                </div>
              </IonLabel>
            </IonCardContent>
          </IonCard>
        ) : (
          <div className="ion-padding">
            <IonButton
              expand="block"
              shape="round"
              onClick={() => {
                searchMentee();
              }}
            >
              <IonIcon icon={searchOutline} slot="start" />
              Tìm thông tin Mentee
            </IonButton>
          </div>
        )}

        <IonLoading isOpen={isLoading} />
      </IonContent>
    </IonPage>
  );
};

export default In2CLCHomePage;
