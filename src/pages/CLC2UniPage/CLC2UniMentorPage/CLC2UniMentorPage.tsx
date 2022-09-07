import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonChip,
  IonContent,
  IonHeader,
  IonImg,
  IonItem,
  IonLabel,
  IonMenuButton,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { t } from "i18next";
import React from "react";
import { useHistory } from "react-router";
import "./CLC2UniMentorPage.scss";

const CLC2UniMentorPage: React.FC = () => {
  const history = useHistory();
  return (
    <IonPage id="clc2uni-mentor-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>CLC2Uni</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <IonCard>
            <IonItem lines="none" style={{ marginTop: 10 }}>
              <IonAvatar
                slot="start"
                onClick={() => {
                  history.push(`/my/user/`);
                }}
              >
                <IonImg src={"/assets/image/placeholder.png"} />
              </IonAvatar>
              <IonLabel text-wrap color="dark">
                <IonText color="dark">
                  <p
                    onClick={() => {
                      history.push(`/my/user/`);
                    }}
                  >
                    <b>{"Hello how are you"}</b>
                  </p>
                </IonText>
              </IonLabel>
            </IonItem>
            <IonCardContent style={{ paddingTop: 0, paddingBottom: 0 }}>
              <IonLabel text-wrap color="dark">
                {
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
                }
              </IonLabel>

              <div style={{ marginTop: 8, marginBottom: 16 }}>
                <IonButton
                  color="primary"
                  expand="block"
                  shape="round"
                  onClick={() => {}}
                >
                  {t("Visit link")}
                </IonButton>
              </div>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default CLC2UniMentorPage;
