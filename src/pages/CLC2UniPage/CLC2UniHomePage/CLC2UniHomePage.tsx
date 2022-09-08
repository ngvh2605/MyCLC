import {
  IonButton,
  IonButtons,
  IonCard,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonMenuButton,
  IonModal,
  IonPage,
  IonRadio,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { checkmark } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../../auth";
import { getInfoByUserId } from "../../HomePage/services";
import { User } from "../../UserPage/UserPage";

const CLC2UniHomePage: React.FC = () => {
  const { userId } = useAuth();
  const [showMentorModal, setShowMentorModal] = useState(false);

  const [userInfo, setUserInfo] = useState<User>();

  const fetchUserInfo = async () => {
    const data = await getInfoByUserId(userId);
    console.log("userInfo", data);
    setUserInfo({ ...data });
  };

  const checkUser = (text: string, data: string) => {
    return (
      <IonItem>
        <IonLabel>{text}</IonLabel>
        {data ? (
          <IonIcon icon={checkmark} slot="end" color="success" />
        ) : (
          <IonIcon icon={checkmark} slot="end" color="danger" />
        )}
      </IonItem>
    );
  };

  return (
    <IonPage>
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
            <IonImg src="https://i.ibb.co/19hLVJj/246739180-3928149053955342-1703980696318181476-n.png" />
          </IonCard>

          <IonButton
            expand="full"
            shape="round"
            onClick={async () => {
              await fetchUserInfo();
              setShowMentorModal(true);
            }}
          >
            Trở thành Mentor
          </IonButton>
        </div>

        {/* Mentor Modal */}
        <IonModal
          isOpen={showMentorModal}
          onDidDismiss={() => {
            setShowMentorModal(false);
          }}
        >
          <IonHeader>
            <IonToolbar>
              <IonTitle>Đăng ký Mentor</IonTitle>
              <IonButtons slot="start">
                <IonButton>Huỷ</IonButton>
              </IonButtons>
              <IonButtons slot="end">
                <IonButton>
                  <b>Gửi</b>
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonList>
              {checkUser(
                "Intro",
                userInfo && userInfo.intro ? userInfo.intro : ""
              )}
              {checkUser(
                "Phone",
                userInfo && userInfo.phoneNumber ? userInfo.phoneNumber : ""
              )}
              {checkUser(
                "Facebook",
                userInfo && userInfo.facebook ? userInfo.facebook : ""
              )}
              <IonItem>
                <IonLabel position="stacked">
                  <b>About me</b>
                  <br />
                  <i>Giới thiệu bản thân</i>
                </IonLabel>
                <IonInput placeholder="Type here" disabled />
              </IonItem>
              <br />
              <IonItem>
                <IonLabel position="stacked">
                  <b>Chủ đề</b>
                  <br />
                  <i>Những gì bạn có thể giúp đỡ</i>
                </IonLabel>
                <IonInput placeholder="Type here" />
              </IonItem>
            </IonList>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default CLC2UniHomePage;
